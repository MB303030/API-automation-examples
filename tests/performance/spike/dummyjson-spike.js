import http from 'k6/http';
import { check, sleep } from 'k6';
import { 
  getProductsEndpoint,
  getProductByIdEndpoint,
  searchProductsEndpoint,
  getProductsByCategoryEndpoint
} from '../../../utils/config/endpoints.js';

// Load traffic patterns from file
const trafficData = JSON.parse(open('../../test-data/trafficPatterns.json'));

export const options = {
  // Use spike stages from file
  stages: trafficData.patterns.spike_test.stages,
  
  // Use spike thresholds from file
  thresholds: trafficData.thresholds.spike,
};

export default function () {
  // SPIKE BEHAVIOR: Flash sale or viral content scenario
  
  // During spikes, many users REFRESH the same page
  const refreshCount = Math.random() < 0.6 ? Math.floor(Math.random() * 3) + 1 : 1;
  
  for (let i = 0; i < refreshCount; i++) {
    // SCENARIO 1: Browse first page (90% during spike)
    if (Math.random() < 0.9) {
      // Small page size for faster loading during spike
      const limit = Math.floor(Math.random() * 5) + 1; // 1-5 products
      const products = http.get(getProductsEndpoint(limit, 0));
      
      check(products, {
        'page loaded during spike': (r) => r.status === 200,
        'fast spike response': (r) => r.timings.duration < 1500,
      });
    }
    
    // SCENARIO 2: View popular product (70% during spike)
    if (Math.random() < 0.7) {
      // Only top 5 popular products during spike
      const popularIds = [1, 2, 3, 4, 5];
      const productId = popularIds[Math.floor(Math.random() * popularIds.length)];
      const product = http.get(getProductByIdEndpoint(productId));
      
      check(product, {
        'popular product loaded': (r) => r.status === 200,
      });
    }
    
    // SCENARIO 3: Search for trending items (50% during spike)
    if (Math.random() < 0.5) {
      const trendingTerms = ['phone', 'sale', 'discount', 'laptop'];
      const term = trendingTerms[Math.floor(Math.random() * trendingTerms.length)];
      const search = http.get(searchProductsEndpoint(term));
      
      check(search, {
        'search successful during spike': (r) => r.status === 200,
      });
    }
    
    // SCENARIO 4: Browse by category (30% during spike)
    if (Math.random() < 0.3) {
      const popularCategories = ['smartphones', 'laptops', 'fragrances'];
      const category = popularCategories[Math.floor(Math.random() * popularCategories.length)];
      const categoryProducts = http.get(getProductsByCategoryEndpoint(category));
      
      check(categoryProducts, {
        'category browse worked': (r) => r.status === 200,
      });
    }
    
    // VERY short pause between rapid actions during spike
    if (i < refreshCount - 1) {
      sleep(Math.random() * 0.2); // 0-0.2 seconds
    }
  }
  
  // Final short think time after spike activity
  sleep(Math.random() * 0.5 + 0.1); // 0.1-0.6 seconds
}