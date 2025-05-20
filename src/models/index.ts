import Category from "./Category";
import Product from "./Product";
import User from "./User";
import Order from "./Order";
import OrderItem from "./OrderItem";

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
});

Category.hasMany(Product, {
  foreignKey: 'categoryId',
  onDelete: 'CASCADE',
});

User.hasMany(Product, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Product.belongsTo(User, {
  foreignKey: 'userId',
});

User.hasMany(Order, {
  foreignKey: 'userId',
    onDelete: 'CASCADE',
});

Order.belongsTo(User, {
  foreignKey: 'userId',
});

Order.belongsToMany(Product, {
  through: OrderItem,
    foreignKey: 'orderId',
});

Product.belongsToMany(Order, {
  through: OrderItem,
    foreignKey: 'productId',
});

export { User, Product, Category, Order, OrderItem };