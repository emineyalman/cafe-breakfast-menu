import React, { useState } from 'react';
import './Menu.css';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tüm Menü' },
    { id: 'breakfast', name: 'Kahvaltı' },
    { id: 'main', name: 'Ana Yemekler' },
    { id: 'desserts', name: 'Tatlılar' },
    { id: 'drinks', name: 'İçecekler' },
    { id: 'salads', name: 'Salatalar' },
    { id: 'sides', name: 'Yan Ürünler' },
    { id: 'beverages', name: 'İçecekler' },
    { id: 'alcohol', name: 'Alkolsüz İçecekler' },
    { id: 'alcoholic', name: 'Alkollü İçecekler' }
  ];

  const menuItems = [
    {
      id: 1,
      name: 'Serpme Kahvaltı',
      category: 'breakfast',
      price: '350',
      description: 'Zengin çeşitlerle geleneksel Türk kahvaltısı',
      image: '/images/breakfast.jpg'
    },
    {
      id: 2,
      name: 'İskender Kebap',
      category: 'main',
      price: '280',
      description: 'Özel soslu, tereyağlı İskender kebap',
      image: '/images/iskender.jpg'
    },
    {
      id: 3,
      name: 'Künefe',
      category: 'desserts',
      price: '120',
      description: 'Antep fıstıklı özel künefe',
      image: '/images/kunefe.jpg'
    },
    {
      id: 4,
      name: 'Türk Kahvesi',
      category: 'drinks',
      price: '45',
      description: 'Geleneksel Türk kahvesi',
      image: '/images/coffee.jpg'
      },
    {
      id: 5,
      name: 'Kabak Salatası',
      category: 'salads',
      price: '100',
      description: 'Kabak ve limonlu salata',
      image: '/images/salad.jpg'
    },
    {
      id: 6,
      name: 'Patates Kızartması', 
      category: 'sides',
      price: '50',
      description: 'Kızartılmış patates',
      image: '/images/potato.jpg'
      },
    {
      id: 7,
      name: 'Kola',
      category: 'beverages',
      price: '25',
      description: 'Gazlı içecek',
      image: '/images/cola.jpg'
      },
    {
      id: 8,
      name: 'Kola',
      category: 'alcohol',
      price: '25',
      description: 'Gazlı içecek',
      image: '/images/cola.jpg'
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="menu-container">
      <h1 className="menu-title">Menümüz</h1>
      
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="menu-item">
            <div className="menu-item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="menu-item-content">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="menu-item-footer">
                <span className="price">₺{item.price}</span>
                <button className="order-button">
                  <i className="fas fa-plus"></i>
                  Sipariş Ver
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu; 