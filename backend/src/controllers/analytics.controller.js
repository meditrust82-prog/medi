const Order = require('../models/Order');
const Product = require('../models/Product');

const getDashboardAnalytics = async (req, res, next) => {
  try {
    // Fetch all orders for calculation
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    
    // Get all products to look up current costs (for historical cost, use order item.cost)
    const productIds = [...new Set(orders.flatMap(o => o.items.map(i => i.product?.toString())))];
    const products = await Product.find({ _id: { $in: productIds } }).select('_id cost').lean();
    const costMap = Object.fromEntries(products.map(p => [p._id.toString(), p.cost || 0]));

    // Calculate totals
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    
    // Product-level stats
    const productStats = {};
    
    orders.forEach(order => {
      const orderRevenue = order.totalPrice || order.items.reduce((s, i) => s + (i.price * i.quantity), 0);
      let orderCost = 0;
      
      order.items.forEach(item => {
        // Use cost snapshot if available, otherwise current product cost
        const itemCost = item.cost ?? costMap[item.product?.toString()] ?? 0;
        const itemTotalCost = itemCost * item.quantity;
        const itemRevenue = item.price * item.quantity;
        const itemProfit = itemRevenue - itemTotalCost;
        
        orderCost += itemTotalCost;
        
        const pid = item.product?.toString();
        if (!productStats[pid]) {
          productStats[pid] = { 
            name: item.name, 
            sold: 0, 
            revenue: 0, 
            cost: 0, 
            profit: 0 
          };
        }
        productStats[pid].sold += item.quantity;
        productStats[pid].revenue += itemRevenue;
        productStats[pid].cost += itemTotalCost;
        productStats[pid].profit += itemProfit;
      });
      
      totalRevenue += orderRevenue;
      totalCost += orderCost;
    });
    
    totalProfit = totalRevenue - totalCost;
    
    // Sort products by profit
    const topProducts = Object.values(productStats)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10);

    res.json({
      summary: {
        totalOrders: orders.length,
        totalRevenue,
        totalCost,
        totalProfit,
        profitMargin: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0,
      },
      topProducts,
      recentOrders: orders.slice(0, 10).map(o => ({
        id: o._id,
        total: o.totalPrice,
        status: o.status,
        date: o.createdAt,
      })),
    });
  } catch (err) { next(err); }
};

module.exports = { getDashboardAnalytics };
