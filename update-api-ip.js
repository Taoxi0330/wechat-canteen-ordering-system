const fs = require('fs');
const path = require('path');

const files = [
  'pages/personal-info/personal-info.js',
  'pages/order-detail/order-detail.js',
  'pages/my-reviews/my-reviews.wxml',
  'pages/my-reviews/my-reviews.js',
  'pages/merchant/detail/detail.js',
  'pages/me/me.js',
  'pages/login/login.js',
  'pages/index/index.js',
  'pages/history/history.wxml',
  'pages/history/history.js',
  'pages/favorite/favorite.js',
  'pages/evaluate/evaluate.wxml',
  'pages/evaluate/evaluate.js',
  'pages/checkout/checkout.js',
  'pages/address-list/address-list.js',
  'pages/address-edit/address-edit.js',
  'pages/register/register.js',
  'pages/order/order.js'
];

const oldIp = '192.168.21.250:3000';
const newIp = '192.168.50.250:3000';

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes(oldIp)) {
      content = content.replace(new RegExp(oldIp, 'g'), newIp);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated: ${file}`);
    }
  }
});

console.log('All files updated successfully!');