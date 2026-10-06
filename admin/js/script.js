// 商家管理系统前端逻辑

// API基础URL
const API_BASE_URL = 'http://localhost:3000/api';

// DOM元素
const elements = {
    // 登录相关
    loginSection: document.getElementById('login-section'),
    mainSection: document.getElementById('main-section'),
    loginUsername: document.getElementById('login-username'),
    loginPassword: document.getElementById('login-password'),
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // 注册相关
    registerUsername: document.getElementById('register-username'),
    registerPassword: document.getElementById('register-password'),
    registerPhone: document.getElementById('register-phone'),
    registerBtn: document.getElementById('register-btn'),
    
    // 标签切换
    authTabs: document.querySelectorAll('.auth-tab'),
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    
    // 导航相关
    navItems: document.querySelectorAll('.nav-item'),
    contentSections: document.querySelectorAll('.content-section'),
    
    // 商家管理
    merchantsSection: document.getElementById('merchants-section'),
    addMerchantBtn: document.getElementById('add-merchant-btn'),
    merchantCanteenFilter: document.getElementById('merchant-canteen-filter'),
    merchantsList: document.getElementById('merchants-list'),
    
    // 菜品管理
    dishesSection: document.getElementById('dishes-section'),
    dishMerchantSelect: document.getElementById('dish-merchant-select'),
    addDishBtn: document.getElementById('add-dish-btn'),
    dishesList: document.getElementById('dishes-list'),
    
    // 订单管理
    ordersSection: document.getElementById('orders-section'),
    ordersList: document.getElementById('orders-list'),
    
    // 评价管理
    reviewsSection: document.getElementById('reviews-section'),
    reviewsList: document.getElementById('reviews-list'),
    
    // 回复评价模态框
    replyModal: document.getElementById('reply-modal'),
    replyCloseBtn: document.querySelector('#reply-modal .close'),
    replyReviewId: document.getElementById('reply-review-id'),
    replyReviewContent: document.getElementById('reply-review-content'),
    replyContent: document.getElementById('reply-content'),
    replySaveBtn: document.getElementById('reply-save-btn'),
    replyCancelBtn: document.getElementById('reply-cancel-btn'),
    
    // 用户管理
    usersSection: document.getElementById('users-section'),
    usersList: document.getElementById('users-list'),
    userSearch: document.getElementById('user-search'),
    userSearchBtn: document.getElementById('user-search-btn'),
    
    // 用户编辑模态框
    userModal: document.getElementById('user-modal'),
    userModalTitle: document.getElementById('user-modal-title'),
    userCloseBtn: document.querySelector('#user-modal .close'),
    userId: document.getElementById('user-id'),
    userUsername: document.getElementById('user-username'),
    userPhone: document.getElementById('user-phone'),
    userAvatar: document.getElementById('user-avatar'),
    userPassword: document.getElementById('user-password'),
    userSaveBtn: document.getElementById('user-save-btn'),
    userCancelBtn: document.getElementById('user-cancel-btn'),
    
    // 商家模态框
    merchantModal: document.getElementById('merchant-modal'),
    merchantModalTitle: document.getElementById('merchant-modal-title'),
    merchantCloseBtn: document.querySelector('#merchant-modal .close'),
    merchantId: document.getElementById('merchant-id'),
    merchantCanteen: document.getElementById('merchant-canteen'),
    merchantName: document.getElementById('merchant-name'),
    merchantDescription: document.getElementById('merchant-description'),
    merchantHours: document.getElementById('merchant-hours'),
    merchantImage: document.getElementById('merchant-image'),
    merchantImagePreview: document.getElementById('merchant-image-preview'),
    selectMerchantImageBtn: document.getElementById('select-merchant-image-btn'),
    merchantSaveBtn: document.getElementById('merchant-save-btn'),
    merchantCancelBtn: document.getElementById('merchant-cancel-btn'),
    
    // 菜品模态框
    dishModal: document.getElementById('dish-modal'),
    dishModalTitle: document.getElementById('dish-modal-title'),
    dishCloseBtn: document.querySelector('#dish-modal .close'),
    dishId: document.getElementById('dish-id'),
    dishName: document.getElementById('dish-name'),
    dishDescription: document.getElementById('dish-description'),
    dishPrice: document.getElementById('dish-price'),
    dishCategory: document.getElementById('dish-category'),
    dishSpiciness: document.getElementById('dish-spiciness'),
    specPricesContainer: document.getElementById('spec-prices-container'),
    addSpecPriceBtn: document.getElementById('add-spec-price-btn'),
    dishImage: document.getElementById('dish-image'),
    dishImagePreview: document.getElementById('dish-image-preview'),
    selectDishImageBtn: document.getElementById('select-dish-image-btn'),
    dishSaveBtn: document.getElementById('dish-save-btn'),
    dishCancelBtn: document.getElementById('dish-cancel-btn'),
    
    // 营养信息输入框
    nutritionProtein: document.getElementById('nutrition-protein'),
    nutritionCarbs: document.getElementById('nutrition-carbs'),
    nutritionFat: document.getElementById('nutrition-fat'),
    nutritionVitaminA: document.getElementById('nutrition-vitaminA'),
    nutritionVitaminC: document.getElementById('nutrition-vitaminC'),
    nutritionCalcium: document.getElementById('nutrition-calcium'),
    nutritionIron: document.getElementById('nutrition-iron'),
    nutritionFiber: document.getElementById('nutrition-fiber'),
    nutritionCalories: document.getElementById('nutrition-calories'),
    
    // 图片选择器模态框
    imageSelectorModal: document.getElementById('image-selector-modal'),
    imageSelectorCloseBtn: document.querySelector('#image-selector-modal .close'),
    imageGrid: document.getElementById('image-grid'),
    imageSelectorCancelBtn: document.getElementById('image-selector-cancel-btn'),
    uploadArea: document.getElementById('upload-area'),
    fileInput: document.getElementById('file-input'),
    
    // 订单详情模态框
    orderDetailModal: document.getElementById('order-detail-modal'),
    orderDetailCloseBtn: document.getElementById('order-detail-close-btn'),
    orderDetailHeaderCloseBtn: document.querySelector('#order-detail-modal .close'),
    orderDetailContent: document.getElementById('order-detail-content'),
    
    // 订单分析
    analyticsSection: document.getElementById('analytics-section'),
    analyticsTimeFilter: document.getElementById('analytics-time-filter'),
    analyticsMerchantFilter: document.getElementById('analytics-merchant-filter'),
    dishSalesChart: document.getElementById('dish-sales-chart'),
    orderCompletionChart: document.getElementById('order-completion-chart'),
    merchantOrdersChart: document.getElementById('merchant-orders-chart'),
    orderTypeChart: document.getElementById('order-type-chart'),
    
    // 提示框
    toast: document.getElementById('toast')
};

// 全局变量
let currentMerchantId = '';
let canteens = [];
let currentImageTarget = ''; // 'merchant' 或 'dish'
let images = [];
let orderUpdateInterval = null; // 订单更新轮询定时器

// 初始化
function init() {
    // 绑定事件
    bindEvents();
    
    // 检查是否已登录
    checkLogin();
}

// 绑定事件
function bindEvents() {
    // 登录事件
    elements.loginBtn.addEventListener('click', login);
    
    // 注册事件
    elements.registerBtn.addEventListener('click', register);
    
    // 登出事件
    elements.logoutBtn.addEventListener('click', logout);
    
    // 标签切换事件
    elements.authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;
            switchAuthTab(tabType);
        });
    });
    
    // 导航事件
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            switchSection(section);
        });
    });
    
    // 商家管理事件
    elements.addMerchantBtn.addEventListener('click', () => openMerchantModal());
    elements.merchantCanteenFilter.addEventListener('change', filterMerchants);
    elements.merchantSaveBtn.addEventListener('click', saveMerchant);
    elements.merchantCancelBtn.addEventListener('click', closeMerchantModal);
    elements.selectMerchantImageBtn.addEventListener('click', () => openImageSelector('merchant'));
    
    // 菜品管理事件
    elements.dishMerchantSelect.addEventListener('change', () => {
        currentMerchantId = elements.dishMerchantSelect.value;
        loadDishes();
    });
    elements.addDishBtn.addEventListener('click', () => openDishModal());
    elements.dishSaveBtn.addEventListener('click', saveDish);
    elements.dishCancelBtn.addEventListener('click', closeDishModal);
    elements.selectDishImageBtn.addEventListener('click', () => openImageSelector('dish'));
    elements.addSpecPriceBtn.addEventListener('click', addSpecPrice);
    
    // 图片选择器事件
    elements.imageSelectorCancelBtn.addEventListener('click', closeImageSelector);
    elements.uploadArea.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileUpload);
    
    // 订单详情模态框事件
    elements.orderDetailCloseBtn.addEventListener('click', closeOrderDetailModal);
    
    // 回复评价模态框事件
    elements.replyCloseBtn.addEventListener('click', closeReplyModal);
    elements.replySaveBtn.addEventListener('click', saveReply);
    elements.replyCancelBtn.addEventListener('click', closeReplyModal);
    
    // 用户管理事件
    elements.userSearchBtn.addEventListener('click', searchUsers);
    elements.userSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchUsers();
        }
    });
    
    // 用户编辑模态框事件
    elements.userCloseBtn.addEventListener('click', closeUserModal);
    elements.userSaveBtn.addEventListener('click', saveUser);
    elements.userCancelBtn.addEventListener('click', closeUserModal);
    
    // 订单分析事件
    elements.analyticsTimeFilter.addEventListener('change', loadAnalyticsData);
    elements.analyticsMerchantFilter.addEventListener('change', loadAnalyticsData);
    
    // 点击模态框外部关闭模态框
    window.addEventListener('click', (e) => {
        if (e.target === elements.merchantModal) closeMerchantModal();
        if (e.target === elements.dishModal) closeDishModal();
        if (e.target === elements.imageSelectorModal) closeImageSelector();
        if (e.target === elements.orderDetailModal) closeOrderDetailModal();
        if (e.target === elements.replyModal) closeReplyModal();
        if (e.target === elements.userModal) closeUserModal();
    });
}

// 检查登录状态
function checkLogin() {
    const token = localStorage.getItem('token');
    if (token) {
        // 已登录，显示主界面
        elements.loginSection.style.display = 'none';
        elements.mainSection.style.display = 'block';
        switchSection('merchants');
    } else {
        // 未登录，显示登录界面
        elements.loginSection.style.display = 'block';
        elements.mainSection.style.display = 'none';
    }
}

// 登录
function login() {
    const username = elements.loginUsername.value;
    const password = elements.loginPassword.value;
    
    if (!username || !password) {
        showToast('请输入用户名和密码', 'error');
        return;
    }
    
    axios.post(`${API_BASE_URL}/login`, { username, password })
        .then(response => {
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                checkLogin();
            } else {
                showToast('登录失败：' + response.data.message, 'error');
            }
        })
        .catch(error => {
            console.error('登录失败:', error);
            showToast('登录失败，请检查网络连接', 'error');
        });
}

// 登出
function logout() {
    localStorage.removeItem('token');
    checkLogin();
}

// 注册
function register() {
    const username = elements.registerUsername.value;
    const password = elements.registerPassword.value;
    const phone = elements.registerPhone.value;
    
    if (!username || !password || !phone) {
        showToast('请输入用户名、密码和手机号', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('密码长度至少6位', 'error');
        return;
    }
    
    // 简单的手机号验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        showToast('请输入正确的手机号', 'error');
        return;
    }
    
    axios.post(`${API_BASE_URL}/register`, { username, password, phone })
        .then(response => {
            if (response.data.success) {
                showToast('注册成功，请登录', 'success');
                // 切换到登录标签
                switchAuthTab('login');
                // 清空注册表单
                elements.registerUsername.value = '';
                elements.registerPassword.value = '';
                elements.registerPhone.value = '';
            } else {
                showToast('注册失败：' + response.data.message, 'error');
            }
        })
        .catch(error => {
            console.error('注册失败:', error);
            showToast('注册失败，请检查网络连接', 'error');
        });
}

// 切换登录/注册标签
function switchAuthTab(tabType) {
    // 更新标签状态
    elements.authTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.auth-tab[data-tab="${tabType}"]`).classList.add('active');
    
    // 显示对应的表单
    if (tabType === 'login') {
        elements.loginForm.style.display = 'block';
        elements.registerForm.style.display = 'none';
    } else if (tabType === 'register') {
        elements.loginForm.style.display = 'none';
        elements.registerForm.style.display = 'block';
    }
}

// 切换内容区域
function switchSection(section) {
    elements.contentSections.forEach(s => s.style.display = 'none');
    
    // 停止所有轮询
    stopOrderUpdatePolling();
    stopUserAutoRefresh();
    
    if (section === 'merchants') {
        elements.merchantsSection.style.display = 'block';
        loadCanteens();
        loadMerchants();
    } else if (section === 'dishes') {
        elements.dishesSection.style.display = 'block';
        loadMerchantsForSelect();
    } else if (section === 'orders') {
        elements.ordersSection.style.display = 'block';
        loadOrders();
        // 启动订单更新轮询
        startOrderUpdatePolling();
    } else if (section === 'reviews') {
        elements.reviewsSection.style.display = 'block';
        loadReviews();
    } else if (section === 'users') {
        elements.usersSection.style.display = 'block';
        loadUsers();
        // 启动用户列表自动刷新
        startUserAutoRefresh();
    } else if (section === 'analytics') {
        elements.analyticsSection.style.display = 'block';
        loadMerchantsForAnalytics();
        loadAnalyticsData();
    }
}

// 启动订单更新轮询
function startOrderUpdatePolling() {
    // 每20秒更新一次订单
    orderUpdateInterval = setInterval(() => {
        console.log('正在更新订单...');
        loadOrders();
    }, 20000); // 20秒
}

// 停止订单更新轮询
function stopOrderUpdatePolling() {
    if (orderUpdateInterval) {
        clearInterval(orderUpdateInterval);
        orderUpdateInterval = null;
    }
}

// 加载食堂列表
function loadCanteens() {
    // 清除缓存，强制重新加载
    canteens = [];
    
    axios.get(`${API_BASE_URL}/canteens`)
        .then(response => {
            canteens = response.data;
            renderCanteenSelects();
        })
        .catch(error => {
            console.error('加载食堂列表失败:', error);
            showToast('加载食堂列表失败', 'error');
        });
}

// 渲染食堂选择框
function renderCanteenSelects() {
    // 使用 Set 去重，确保每个食堂只显示一次
    const uniqueCanteens = [];
    const canteenIds = new Set();
    
    canteens.forEach(canteen => {
        if (!canteenIds.has(canteen.id)) {
            canteenIds.add(canteen.id);
            uniqueCanteens.push(canteen);
        }
    });
    
    // 只保留ID为1、2、3的食堂（一食堂、二食堂、三食堂）
    const allowedIds = [1, 2, 3];
    const filteredCanteens = uniqueCanteens.filter(canteen => 
        allowedIds.includes(canteen.id)
    );
    
    // 渲染筛选下拉框
    let filterOptions = '<option value="">全部食堂</option>';
    filteredCanteens.forEach(canteen => {
        filterOptions += `<option value="${canteen.id}">${canteen.name}</option>`;
    });
    elements.merchantCanteenFilter.innerHTML = filterOptions;
    
    // 渲染商家模态框中的食堂选择框
    let modalOptions = '<option value="">请选择食堂</option>';
    filteredCanteens.forEach(canteen => {
        modalOptions += `<option value="${canteen.id}">${canteen.name}</option>`;
    });
    elements.merchantCanteen.innerHTML = modalOptions;
}

// 根据食堂ID获取食堂名称
function getCanteenName(canteenId) {
    const uniqueCanteens = [];
    const canteenIds = new Set();
    
    canteens.forEach(canteen => {
        if (!canteenIds.has(canteen.id)) {
            canteenIds.add(canteen.id);
            uniqueCanteens.push(canteen);
        }
    });
    
    // 只保留ID为1、2、3的食堂（一食堂、二食堂、三食堂）
    const allowedIds = [1, 2, 3];
    const filteredCanteens = uniqueCanteens.filter(canteen => 
        allowedIds.includes(canteen.id)
    );
    
    const canteen = filteredCanteens.find(c => c.id == canteenId);
    return canteen ? canteen.name : '未知食堂';
}

// 加载商家列表（用于选择框）
function loadMerchantsForSelect() {
    axios.get(`${API_BASE_URL}/merchants`)
        .then(response => {
            const merchants = response.data;
            let options = '<option value="">请选择商家</option>';
            merchants.forEach(merchant => {
                options += `<option value="${merchant.id}">${merchant.name}</option>`;
            });
            elements.dishMerchantSelect.innerHTML = options;
        })
        .catch(error => {
            console.error('加载商家列表失败:', error);
            showToast('加载商家列表失败', 'error');
        });
}

// 加载商家列表
function loadMerchants() {
    const canteenId = elements.merchantCanteenFilter.value;
    const url = canteenId ? `${API_BASE_URL}/merchants?canteen=${canteenId}` : `${API_BASE_URL}/merchants`;
    
    axios.get(url)
        .then(response => {
            const merchants = response.data;
            renderMerchants(merchants);
        })
        .catch(error => {
            console.error('加载商家列表失败:', error);
            showToast('加载商家列表失败', 'error');
        });
}

// 渲染商家列表
function renderMerchants(merchants) {
    elements.merchantsList.innerHTML = '';
    
    merchants.forEach(merchant => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${merchant.id}</td>
            <td>${getCanteenName(merchant.canteen_id)}</td>
            <td>${merchant.name}</td>
            <td>${merchant.description}</td>
            <td>${merchant.business_hours || ''}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openMerchantModal(${merchant.id})">编辑</button>
                <button class="btn btn-danger btn-sm" onclick="deleteMerchant(${merchant.id})">删除</button>
            </td>
        `;
        
        elements.merchantsList.appendChild(row);
    });
}

// 筛选商家
function filterMerchants() {
    loadMerchants();
}

// 打开商家模态框
function openMerchantModal(merchantId = null) {
    if (merchantId) {
        // 编辑模式
        elements.merchantModalTitle.textContent = '编辑商家';
        axios.get(`${API_BASE_URL}/merchants/${merchantId}`)
            .then(response => {
                const merchant = response.data;
                elements.merchantId.value = merchant.id;
                elements.merchantCanteen.value = merchant.canteen_id;
                elements.merchantName.value = merchant.name;
                elements.merchantDescription.value = merchant.description;
                elements.merchantHours.value = merchant.business_hours;
                elements.merchantImage.value = merchant.image;
                elements.merchantImagePreview.src = merchant.image || '/images/default-image.jpg';
            })
            .catch(error => {
                console.error('获取商家信息失败:', error);
                showToast('获取商家信息失败', 'error');
            });
    } else {
        // 添加模式
        elements.merchantModalTitle.textContent = '添加商家';
        elements.merchantId.value = '';
        elements.merchantCanteen.value = '';
        elements.merchantName.value = '';
        elements.merchantDescription.value = '';
        elements.merchantHours.value = '';
        elements.merchantImage.value = '';
        elements.merchantImagePreview.src = '/images/default-image.jpg';
    }
    elements.merchantModal.classList.add('show');
    // 绑定关闭按钮事件
    const merchantCloseBtn = document.querySelector('#merchant-modal .close');
    merchantCloseBtn.addEventListener('click', closeMerchantModal);
}

// 关闭商家模态框
function closeMerchantModal() {
    elements.merchantModal.classList.remove('show');
}

// 保存商家
function saveMerchant() {
    const merchantId = elements.merchantId.value;
    const merchantData = {
        canteen_id: elements.merchantCanteen.value,
        name: elements.merchantName.value,
        description: elements.merchantDescription.value,
        business_hours: elements.merchantHours.value,
        image: elements.merchantImage.value
    };
    
    if (!merchantData.canteen_id) {
        showToast('请选择食堂', 'error');
        return;
    }
    
    if (!merchantData.name) {
        showToast('请输入商家名称', 'error');
        return;
    }
    
    if (merchantId) {
        // 更新商家
        axios.put(`${API_BASE_URL}/merchants/${merchantId}`, merchantData)
            .then(response => {
                if (response.data.success) {
                    showToast('商家更新成功', 'success');
                    closeMerchantModal();
                    loadMerchants();
                } else {
                    showToast('商家更新失败：' + response.data.message, 'error');
                }
            })
            .catch(error => {
                console.error('更新商家失败:', error);
                showToast('更新商家失败，请检查网络连接', 'error');
            });
    } else {
        // 添加商家
        axios.post(`${API_BASE_URL}/merchants`, merchantData)
            .then(response => {
                if (response.data.success) {
                    showToast('商家添加成功', 'success');
                    closeMerchantModal();
                    loadMerchants();
                } else {
                    showToast('商家添加失败：' + response.data.message, 'error');
                }
            })
            .catch(error => {
                console.error('添加商家失败:', error);
                showToast('添加商家失败，请检查网络连接', 'error');
            });
    }
}

// 删除商家
function deleteMerchant(merchantId) {
    if (confirm('确定要删除这个商家吗？')) {
        axios.delete(`${API_BASE_URL}/merchants/${merchantId}`)
            .then(response => {
                if (response.data.success) {
                    showToast('商家删除成功', 'success');
                    loadMerchants();
                } else {
                    showToast('商家删除失败：' + response.data.message, 'error');
                }
            })
            .catch(error => {
                console.error('删除商家失败:', error);
                showToast('删除商家失败，请检查网络连接', 'error');
            });
    }
}

// 加载菜品列表
function loadDishes() {
    if (!currentMerchantId) return;
    
    axios.get(`${API_BASE_URL}/dishes/${currentMerchantId}`)
        .then(response => {
            const dishes = response.data;
            renderDishes(dishes);
        })
        .catch(error => {
            console.error('加载菜品列表失败:', error);
            showToast('加载菜品列表失败', 'error');
        });
}

// 渲染菜品列表
function renderDishes(dishes) {
    elements.dishesList.innerHTML = '';
    
    dishes.forEach(dish => {
        // 转换辣度显示
        let spicinessText = '正常';
        if (dish.spiciness === 'mild') {
            spicinessText = '微辣';
        } else if (dish.spiciness === 'spicy') {
            spicinessText = '中辣';
        } else if (dish.spiciness === 'very_spicy') {
            spicinessText = '特辣';
        }
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${dish.id}</td>
            <td>${dish.name}</td>
            <td>${dish.description}</td>
            <td>¥${parseFloat(dish.price || 0).toFixed(2)}</td>
            <td>${dish.category}</td>
            <td>${spicinessText}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openDishModal(${dish.id})">编辑</button>
                <button class="btn btn-danger btn-sm" onclick="deleteDish(${dish.id})">删除</button>
            </td>
        `;
        
        elements.dishesList.appendChild(row);
    });
}

// 打开菜品模态框
function openDishModal(dishId = null) {
    if (dishId) {
        // 编辑模式
        elements.dishModalTitle.textContent = '编辑菜品';
        axios.get(`${API_BASE_URL}/dishes/detail/${dishId}`)
            .then(response => {
                const dish = response.data;
                elements.dishId.value = dish.id;
                elements.dishName.value = dish.name;
                elements.dishDescription.value = dish.description;
                elements.dishPrice.value = dish.price || '';
                elements.dishCategory.value = dish.category;
                elements.dishSpiciness.value = dish.spiciness || 'normal';
                elements.dishImage.value = dish.image;
                elements.dishImagePreview.src = dish.image || '/images/default-dish.jpg';
                
                // 渲染规格价格
                elements.specPricesContainer.innerHTML = '';
                if (dish.spec_prices) {
                    Object.entries(dish.spec_prices).forEach(([spec, price]) => {
                        addSpecPrice(spec, price);
                    });
                }
                
                // 渲染营养信息
                if (dish.nutrition) {
                    const nutrition = dish.nutrition;
                    document.getElementById('nutrition-protein').value = nutrition.protein || '';
                    document.getElementById('nutrition-carbs').value = nutrition.carbs || '';
                    document.getElementById('nutrition-fat').value = nutrition.fat || '';
                    document.getElementById('nutrition-vitaminA').value = nutrition.vitaminA || '';
                    document.getElementById('nutrition-vitaminC').value = nutrition.vitaminC || '';
                    document.getElementById('nutrition-calcium').value = nutrition.calcium || '';
                    document.getElementById('nutrition-iron').value = nutrition.iron || '';
                    document.getElementById('nutrition-fiber').value = nutrition.fiber || '';
                    document.getElementById('nutrition-calories').value = nutrition.calories || '';
                } else {
                    // 清空营养信息输入框
                    document.getElementById('nutrition-protein').value = '';
                    document.getElementById('nutrition-carbs').value = '';
                    document.getElementById('nutrition-fat').value = '';
                    document.getElementById('nutrition-vitaminA').value = '';
                    document.getElementById('nutrition-vitaminC').value = '';
                    document.getElementById('nutrition-calcium').value = '';
                    document.getElementById('nutrition-iron').value = '';
                    document.getElementById('nutrition-fiber').value = '';
                    document.getElementById('nutrition-calories').value = '';
                }
            })
            .catch(error => {
                console.error('获取菜品信息失败:', error);
                showToast('获取菜品信息失败', 'error');
            });
    } else {
        // 添加模式
        elements.dishModalTitle.textContent = '添加菜品';
        elements.dishId.value = '';
        elements.dishName.value = '';
        elements.dishDescription.value = '';
        elements.dishPrice.value = '';
        elements.dishCategory.value = '热菜';
        elements.dishSpiciness.value = 'normal';
        elements.dishImage.value = '';
        elements.dishImagePreview.src = '/images/default-dish.jpg';
        elements.specPricesContainer.innerHTML = '';
        
        // 清空营养信息输入框
        document.getElementById('nutrition-protein').value = '';
        document.getElementById('nutrition-carbs').value = '';
        document.getElementById('nutrition-fat').value = '';
        document.getElementById('nutrition-vitaminA').value = '';
        document.getElementById('nutrition-vitaminC').value = '';
        document.getElementById('nutrition-calcium').value = '';
        document.getElementById('nutrition-iron').value = '';
        document.getElementById('nutrition-fiber').value = '';
        document.getElementById('nutrition-calories').value = '';
    }
    elements.dishModal.classList.add('show');
    // 绑定关闭按钮事件
    const dishCloseBtn = document.querySelector('#dish-modal .close');
    dishCloseBtn.addEventListener('click', closeDishModal);
}

// 关闭菜品模态框
function closeDishModal() {
    elements.dishModal.classList.remove('show');
}

// 添加规格价格
function addSpecPrice(spec = '', price = '') {
    const specPriceDiv = document.createElement('div');
    specPriceDiv.className = 'spec-price';
    
    specPriceDiv.innerHTML = `
        <input type="text" placeholder="规格名称" value="${spec || ''}" class="spec-name">
        <input type="number" placeholder="价格" value="${price || ''}" class="spec-price-input">
        <button class="btn btn-sm btn-danger" onclick="removeSpecPrice(this)">删除</button>
    `;
    
    elements.specPricesContainer.appendChild(specPriceDiv);
}

// 移除规格价格
function removeSpecPrice(btn) {
    btn.parentElement.remove();
}

// 保存菜品
function saveDish() {
    const dishId = elements.dishId.value;
    const specPrices = {};
    document.querySelectorAll('.spec-price').forEach(div => {
        const spec = div.querySelector('.spec-name').value;
        const price = div.querySelector('.spec-price-input').value;
        if (spec && price) {
            specPrices[spec] = parseFloat(price);
        }
    });
    
    // 收集营养信息
    const nutrition = {};
    const protein = document.getElementById('nutrition-protein').value;
    const carbs = document.getElementById('nutrition-carbs').value;
    const fat = document.getElementById('nutrition-fat').value;
    const vitaminA = document.getElementById('nutrition-vitaminA').value;
    const vitaminC = document.getElementById('nutrition-vitaminC').value;
    const calcium = document.getElementById('nutrition-calcium').value;
    const iron = document.getElementById('nutrition-iron').value;
    const fiber = document.getElementById('nutrition-fiber').value;
    const calories = document.getElementById('nutrition-calories').value;
    
    if (protein) nutrition.protein = parseFloat(protein);
    if (carbs) nutrition.carbs = parseFloat(carbs);
    if (fat) nutrition.fat = parseFloat(fat);
    if (vitaminA) nutrition.vitaminA = parseFloat(vitaminA);
    if (vitaminC) nutrition.vitaminC = parseFloat(vitaminC);
    if (calcium) nutrition.calcium = parseFloat(calcium);
    if (iron) nutrition.iron = parseFloat(iron);
    if (fiber) nutrition.fiber = parseFloat(fiber);
    if (calories) nutrition.calories = parseFloat(calories);
    
    const dishData = {
        merchant_id: currentMerchantId,
        name: elements.dishName.value,
        description: elements.dishDescription.value,
        price: parseFloat(elements.dishPrice.value),
        category: elements.dishCategory.value,
        spiciness: elements.dishSpiciness.value,
        image: elements.dishImage.value,
        spec_prices: specPrices,
        nutrition: nutrition
    };
    
    if (!dishData.name) {
        showToast('请输入菜品名称', 'error');
        return;
    }
    
    if (!dishData.price || dishData.price <= 0) {
        showToast('请输入有效的价格', 'error');
        return;
    }
    
    if (dishId) {
        // 更新菜品
        axios.put(`${API_BASE_URL}/dishes/${dishId}`, dishData)
            .then(response => {
                if (response.data.success) {
                    showToast('菜品更新成功', 'success');
                    closeDishModal();
                    loadDishes();
                } else {
                    showToast('菜品更新失败：' + response.data.message, 'error');
                }
            })
            .catch(error => {
                console.error('更新菜品失败:', error);
                showToast('更新菜品失败，请检查网络连接', 'error');
            });
    } else {
        // 添加菜品
        axios.post(`${API_BASE_URL}/dishes`, dishData)
            .then(response => {
                if (response.data.success) {
                    showToast('菜品添加成功', 'success');
                    closeDishModal();
                    loadDishes();
                } else {
                    showToast('菜品添加失败：' + response.data.message, 'error');
                }
            })
            .catch(error => {
                console.error('添加菜品失败:', error);
                showToast('添加菜品失败，请检查网络连接', 'error');
            });
    }
}

// 删除菜品
function deleteDish(dishId) {
    if (confirm('确定要删除这个菜品吗？')) {
        axios.delete(`${API_BASE_URL}/dishes/${dishId}`)
            .then(response => {
                if (response.data.success) {
                    showToast('菜品删除成功', 'success');
                    loadDishes();
                } else {
                    showToast('菜品删除失败：' + response.data.message, 'error');
                }
            })
            .catch(error => {
                console.error('删除菜品失败:', error);
                showToast('删除菜品失败，请检查网络连接', 'error');
            });
    }
}

// 加载订单列表
function loadOrders() {
    console.log('加载订单列表...');
    axios.get(`${API_BASE_URL}/orders`)
        .then(response => {
            console.log('获取订单数据:', response.data);
            const orders = response.data;
            renderOrders(orders);
        })
        .catch(error => {
            console.error('加载订单列表失败:', error);
            // 使用模拟数据
            const mockOrders = [
                { id: 1, user_id: 1, merchant_id: 1, total_price: 66.00, status: 'completed', created_at: '2024-01-15 12:30:00' },
                { id: 2, user_id: 1, merchant_id: 2, total_price: 58.00, status: 'pending', created_at: '2024-01-14 18:45:00' },
                { id: 3, user_id: 2, merchant_id: 3, total_price: 30.00, status: 'completed', created_at: '2024-01-14 12:15:00' },
                { id: 4, user_id: 2, merchant_id: 4, total_price: 25.00, status: 'processing', created_at: '2024-01-15 10:30:00' }
            ];
            console.log('使用模拟数据:', mockOrders);
            renderOrders(mockOrders);
        });
}

// 加载评价列表
function loadReviews() {
    axios.get(`${API_BASE_URL}/reviews`)
        .then(response => {
            const reviews = response.data;
            localStorage.setItem('currentReviews', JSON.stringify(reviews));
            renderReviews(reviews);
        })
        .catch(error => {
            console.error('加载评价列表失败:', error);
            elements.reviewsList.innerHTML = '<tr><td colspan="9" style="text-align:center; color:#999;">加载评价失败</td></tr>';
        });
}

// 渲染评价列表
function renderReviews(reviews) {
    elements.reviewsList.innerHTML = '';
    
    if (reviews.length === 0) {
        elements.reviewsList.innerHTML = '<tr><td colspan="9" style="text-align:center; color:#999;">暂无评价</td></tr>';
        return;
    }
    
    reviews.forEach(review => {
        const row = document.createElement('tr');
        row.setAttribute('data-review-id', review.id);
        
        // 生成星星评分
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= review.rating) {
                starsHtml += '<span style="color: #ffc107;">★</span>';
            } else {
                starsHtml += '<span style="color: #ddd;">★</span>';
            }
        }
        
        // 处理商家回复显示
        let replyHtml = '';
        if (review.reply) {
            replyHtml = `
                <div style="background: #e6f7ff; padding: 8px; border-radius: 4px; border-left: 3px solid #1890ff; margin-bottom: 5px;">
                    <div style="font-size: 12px; color: #1890ff; margin-bottom: 3px;">商家回复：</div>
                    <div style="font-size: 13px; color: #333;">${review.reply}</div>
                    <div style="font-size: 11px; color: #999; margin-top: 3px;">${review.reply_at ? new Date(review.reply_at).toLocaleString('zh-CN', { hour12: false }) : ''}</div>
                </div>
            `;
        }
        
        row.innerHTML = `
            <td>${review.id}</td>
            <td>${review.username || '匿名用户'}</td>
            <td>${review.merchant_name || '-'}</td>
            <td>${review.dish_name || '-'}</td>
            <td>${starsHtml} (${review.rating}分)</td>
            <td>${review.content || '无评价内容'}</td>
            <td>${replyHtml || '<span style="color:#999;">暂无回复</span>'}</td>
            <td>${review.created_at ? new Date(review.created_at).toLocaleString('zh-CN', { hour12: false }) : '未知时间'}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openReplyModal(${review.id}, '${encodeURIComponent(review.content || '')}')" style="margin-right: 5px;">${review.reply ? '编辑回复' : '回复'}${review.reply ? '</button><button class="btn btn-danger btn-sm" onclick="deleteReply(${review.id})" style="margin-right: 5px;">删除回复' : ''}</button>
                <button class="btn btn-danger btn-sm" onclick="deleteReview(${review.id})">删除评价</button>
            </td>
        `;
        
        elements.reviewsList.appendChild(row);
    });
}

// 删除评价
function deleteReview(reviewId) {
    if (!confirm('确定要删除这条评价吗？')) {
        return;
    }
    
    axios.delete(`${API_BASE_URL}/reviews/${reviewId}`)
        .then(response => {
            if (response.data.success) {
                showToast('评价删除成功', 'success');
                loadReviews();
            } else {
                showToast('删除评价失败：' + response.data.message, 'error');
            }
        })
        .catch(error => {
            console.error('删除评价失败:', error);
            showToast('删除评价失败，请检查网络连接', 'error');
        });
}

// 打开回复模态框
function openReplyModal(reviewId, reviewContent) {
    elements.replyReviewId.value = reviewId;
    elements.replyReviewContent.textContent = decodeURIComponent(reviewContent);
    elements.replyContent.value = '';
    
    // 查找该评价的现有回复
    const reviews = JSON.parse(localStorage.getItem('currentReviews') || '[]');
    const review = reviews.find(r => r.id === reviewId);
    if (review && review.reply) {
        elements.replyContent.value = review.reply;
    }
    
    elements.replyModal.style.display = 'flex';
}

// 关闭回复模态框
function closeReplyModal() {
    elements.replyModal.style.display = 'none';
}

// 保存回复
function saveReply() {
    const reviewId = parseInt(elements.replyReviewId.value);
    const reply = elements.replyContent.value.trim();
    
    if (!reply) {
        showToast('回复内容不能为空', 'error');
        return;
    }
    
    axios.put(`${API_BASE_URL}/reviews/${reviewId}/reply`, { reply })
        .then(response => {
            if (response.data.success) {
                showToast('回复成功', 'success');
                closeReplyModal();
                loadReviews();
            } else {
                showToast('回复失败：' + response.data.message, 'error');
            }
        })
        .catch(error => {
            console.error('回复失败:', error);
            showToast('回复失败，请检查网络连接', 'error');
        });
}

// 删除回复
function deleteReply(reviewId) {
    if (!confirm('确定要删除这条回复吗？')) {
        return;
    }
    
    axios.delete(`${API_BASE_URL}/reviews/${reviewId}/reply`)
        .then(response => {
            if (response.data.success) {
                showToast('回复删除成功', 'success');
                loadReviews();
            } else {
                showToast('删除回复失败：' + response.data.message, 'error');
            }
        })
        .catch(error => {
            console.error('删除回复失败:', error);
            showToast('删除回复失败，请检查网络连接', 'error');
        });
}

// 自动刷新定时器
let userRefreshInterval = null;

// 加载用户列表
function loadUsers() {
    axios.get(`${API_BASE_URL}/users`)
        .then(response => {
            const users = response.data;
            renderUsers(users);
        })
        .catch(error => {
            console.error('加载用户列表失败:', error);
            elements.usersList.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#999;">加载用户失败</td></tr>';
        });
}

// 启动用户列表自动刷新
function startUserAutoRefresh() {
    if (userRefreshInterval) {
        clearInterval(userRefreshInterval);
    }
    userRefreshInterval = setInterval(() => {
        // 只在用户管理页面可见时刷新
        if (elements.usersSection.style.display !== 'none') {
            loadUsers();
        }
    }, 5000); // 每5秒刷新一次
}

// 停止用户列表自动刷新
function stopUserAutoRefresh() {
    if (userRefreshInterval) {
        clearInterval(userRefreshInterval);
        userRefreshInterval = null;
    }
}

// 渲染用户列表
function renderUsers(users) {
    elements.usersList.innerHTML = '';
    
    if (users.length === 0) {
        elements.usersList.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#999;">暂无用户</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.setAttribute('data-user-id', user.id);
        
        const avatarHtml = user.avatar ? 
            `<img src="http://localhost:3000${user.avatar}" style="width: 40px; height: 40px; border-radius: 50%;" alt="头像" onerror="this.onerror=null; this.src='http://localhost:3000/images/profile.png';">` : 
            `<img src="http://localhost:3000/images/profile.png" style="width: 40px; height: 40px; border-radius: 50%;" alt="头像">`;
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${avatarHtml}</td>
            <td>${user.phone || '-'}</td>
            <td>${user.created_at ? new Date(user.created_at).toLocaleString('zh-CN', { hour12: false }) : '未知时间'}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openUserModal(${user.id})" style="margin-right: 5px;">编辑</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">删除</button>
            </td>
        `;
        
        elements.usersList.appendChild(row);
    });
}

// 打开用户编辑模态框
function openUserModal(userId) {
    if (userId) {
        // 编辑现有用户
        axios.get(`${API_BASE_URL}/users/${userId}`)
            .then(response => {
                const user = response.data;
                elements.userId.value = user.id;
                elements.userUsername.value = user.username;
                elements.userPhone.value = user.phone || '';
                elements.userAvatar.value = user.avatar || '';
                elements.userPassword.value = '';
                elements.userModalTitle.textContent = '编辑用户';
                elements.userModal.style.display = 'flex';
            })
            .catch(error => {
                console.error('获取用户信息失败:', error);
                showToast('获取用户信息失败', 'error');
            });
    } else {
        // 添加新用户
        elements.userId.value = '';
        elements.userUsername.value = '';
        elements.userPhone.value = '';
        elements.userAvatar.value = '';
        elements.userPassword.value = '';
        elements.userModalTitle.textContent = '添加用户';
        elements.userModal.style.display = 'flex';
    }
}

// 关闭用户编辑模态框
function closeUserModal() {
    elements.userModal.style.display = 'none';
}

// 保存用户信息
function saveUser() {
    const userId = elements.userId.value;
    const username = elements.userUsername.value.trim();
    const phone = elements.userPhone.value.trim();
    const avatar = elements.userAvatar.value.trim();
    const password = elements.userPassword.value.trim();
    
    if (!username) {
        showToast('用户名不能为空', 'error');
        return;
    }
    
    const userData = { username, phone, avatar };
    if (password) {
        userData.password = password;
    }
    
    const url = userId ? `${API_BASE_URL}/users/${userId}` : `${API_BASE_URL}/users`;
    const method = userId ? 'put' : 'post';
    
    axios[method](url, userData)
        .then(response => {
            if (response.data.success) {
                showToast(userId ? '用户更新成功' : '用户添加成功', 'success');
                closeUserModal();
                loadUsers();
            } else {
                showToast(userId ? '用户更新失败' : '用户添加失败', 'error');
            }
        })
        .catch(error => {
            console.error('保存用户失败:', error);
            showToast('保存用户失败，请检查网络连接', 'error');
        });
}

// 删除用户
function deleteUser(userId) {
    if (!confirm('确定要删除这个用户吗？')) {
        return;
    }
    
    axios.delete(`${API_BASE_URL}/users/${userId}`)
        .then(response => {
            if (response.data.success) {
                showToast('用户删除成功', 'success');
                loadUsers();
            } else {
                showToast('用户删除失败：' + response.data.message, 'error');
            }
        })
        .catch(error => {
            console.error('删除用户失败:', error);
            showToast('删除用户失败，请检查网络连接', 'error');
        });
}

// 搜索用户
function searchUsers() {
    const keyword = elements.userSearch.value.trim();
    
    if (!keyword) {
        loadUsers();
        return;
    }
    
    axios.get(`${API_BASE_URL}/users/search`, {
        params: { keyword }
    })
        .then(response => {
            const users = response.data;
            renderUsers(users);
        })
        .catch(error => {
            console.error('搜索用户失败:', error);
            showToast('搜索用户失败，请检查网络连接', 'error');
        });
}

// 渲染订单列表
function renderOrders(orders) {
    elements.ordersList.innerHTML = '';
    
    orders.forEach(order => {
        // 转换状态显示
        let statusText = '待处理';
        let statusClass = '';
        if (order.status === 'completed') {
            statusText = '已完成';
            statusClass = 'completed';
        } else if (order.status === 'pending') {
            statusText = '待处理';
            statusClass = 'pending';
        } else if (order.status === 'processing') {
            statusText = '正在处理';
            statusClass = 'processing';
        } else if (order.status === 'cancelled') {
            statusText = '已取消';
            statusClass = 'cancelled';
        }
        
        // 转换订单类型显示
        let orderTypeText = '堂食';
        if (order.order_type === 'takeaway') {
            orderTypeText = '外卖';
        }
        
        const row = document.createElement('tr');
        row.setAttribute('data-order-id', order.id);
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.user_id}</td>
            <td>${order.merchant_id}</td>
            <td>${orderTypeText}</td>
            <td>¥${parseFloat(order.total_price || 0).toFixed(2)}</td>
            <td>${order.pickup_code || '-'}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${order.created_at ? new Date(order.created_at).toLocaleString('zh-CN', { hour12: false }) : '未知时间'}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="viewOrderDetail(${order.id})">详情</button>
                <button class="btn btn-secondary btn-sm" onclick="updateOrderStatus(${order.id}, 'processing')">开始处理</button>
                <button class="btn btn-success btn-sm" onclick="updateOrderStatus(${order.id}, 'completed')">完成订单</button>
                <button class="btn btn-danger btn-sm" onclick="updateOrderStatus(${order.id}, 'cancelled')">取消订单</button>
            </td>
        `;
        
        elements.ordersList.appendChild(row);
    });
}

// 更新订单状态
function updateOrderStatus(orderId, status) {
    console.log('更新订单状态:', orderId, status);
    
    // 立即更新页面上的订单状态显示，提供即时反馈
    const orderRow = document.querySelector(`tr[data-order-id="${orderId}"]`);
    console.log('找到订单行:', orderRow);
    if (orderRow) {
        const statusBadge = orderRow.querySelector('.status-badge');
        console.log('找到状态徽章:', statusBadge);
        if (statusBadge) {
            // 更新状态文本和样式
            let statusText = '待处理';
            let statusClass = '';
            if (status === 'completed') {
                statusText = '已完成';
                statusClass = 'completed';
            } else if (status === 'pending') {
                statusText = '待处理';
                statusClass = 'pending';
            } else if (status === 'processing') {
                statusText = '正在处理';
                statusClass = 'processing';
            } else if (status === 'cancelled') {
                statusText = '已取消';
                statusClass = 'cancelled';
            }
            
            console.log('更新状态:', statusText, statusClass);
            statusBadge.textContent = statusText;
            statusBadge.className = `status-badge ${statusClass}`;
        }
    }
    
    // 显示处理中提示
    showToast('正在更新订单状态...', 'loading');
    
    // 发送API请求更新服务器上的状态
    axios.put(`${API_BASE_URL}/orders/${orderId}`, { status })
        .then(response => {
            console.log('响应数据:', response.data);
            if (response.data.success) {
                showToast('订单状态更新成功', 'success');
                // 重新加载订单列表以确保数据同步
                loadOrders();
            } else {
                showToast('订单状态更新失败：' + response.data.message, 'error');
                // 如果更新失败，重新加载订单列表以恢复原始状态
                loadOrders();
            }
        })
        .catch(error => {
            console.error('更新订单状态失败:', error);
            showToast('更新订单状态失败，请检查网络连接', 'error');
            // 如果请求失败，重新加载订单列表以恢复原始状态
            loadOrders();
        });
}

// 查看订单详情
function viewOrderDetail(orderId) {
    axios.get(`${API_BASE_URL}/orders/${orderId}`)
        .then(response => {
            const order = response.data;
            renderOrderDetail(order);
            elements.orderDetailModal.classList.add('show');
            // 绑定关闭按钮事件
            const orderDetailCloseBtn = document.querySelector('#order-detail-modal .close');
            orderDetailCloseBtn.addEventListener('click', closeOrderDetailModal);
        })
        .catch(error => {
            console.error('获取订单详情失败:', error);
            showToast('获取订单详情失败', 'error');
        });
}

// 渲染订单详情
function renderOrderDetail(order) {
    // 转换状态显示
    let statusText = '待处理';
    let statusClass = '';
    if (order.status === 'completed') {
        statusText = '已完成';
        statusClass = 'status-completed';
    } else if (order.status === 'pending') {
        statusText = '待处理';
        statusClass = 'status-pending';
    } else if (order.status === 'processing') {
        statusText = '处理中';
        statusClass = 'status-processing';
    }
    
    // 转换订单类型显示
    let orderTypeText = '堂食';
    if (order.order_type === 'takeaway') {
        orderTypeText = '外卖';
    }
    
    // 渲染订单项
    let itemsHtml = '';
    if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
            itemsHtml += `
                <div class="order-item">
                    <img src="${item.image || '/images/default-dish.jpg'}" alt="${item.name}" class="item-image">
                    <div class="item-info">
                        <h4>${item.name || '未知菜品'}</h4>
                        <p>规格：${item.specification || '默认'}</p>
                        <p>辣度：${item.spiciness || '正常'}</p>
                        <p>数量：${item.quantity}</p>
                        <p class="item-price">¥${parseFloat(item.price || 0).toFixed(2)}</p>
                    </div>
                </div>
            `;
        });
    } else {
        itemsHtml = '<p class="no-items">没有订单项</p>';
    }
    
    elements.orderDetailContent.innerHTML = `
        <div class="order-detail-header">
            <h3>订单 #${order.id}</h3>
            <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        <div class="order-detail-info">
            <div class="info-section">
                <h4>基本信息</h4>
                <p><strong>商家：</strong>${order.merchant ? order.merchant.name : '未知商家'}</p>
                <p><strong>用户：</strong>${order.user_id}</p>
                <p><strong>订单类型：</strong>${orderTypeText}</p>
                <p><strong>下单时间：</strong>${order.created_at ? new Date(order.created_at).toLocaleString('zh-CN', { hour12: false }) : '未知时间'}</p>
                <p><strong>更新时间：</strong>${order.updated_at ? new Date(order.updated_at).toLocaleString('zh-CN', { hour12: false }) : '未知时间'}</p>
                <p><strong>备注：</strong>${order.remark || '无'}</p>
            </div>
            <div class="info-section">
                <h4>金额信息</h4>
                <p><strong>总价：</strong>¥${parseFloat(order.total_price || 0).toFixed(2)}</p>
                <p><strong>取餐码：</strong>${order.pickup_code || '无'}</p>
            </div>
        </div>
        <div class="order-items-section">
            <h4>订单项</h4>
            ${itemsHtml}
        </div>
    `;
}

// 关闭订单详情模态框
function closeOrderDetailModal() {
    elements.orderDetailModal.classList.remove('show');
}

// 打开图片选择器
function openImageSelector(target) {
    currentImageTarget = target;
    // 加载图片列表
    loadImages();
    elements.imageSelectorModal.classList.add('show');
    // 绑定关闭按钮事件
    const imageSelectorCloseBtn = document.querySelector('#image-selector-modal .close');
    imageSelectorCloseBtn.addEventListener('click', closeImageSelector);
}

// 关闭图片选择器
function closeImageSelector() {
    elements.imageSelectorModal.classList.remove('show');
}

// 加载图片列表
function loadImages() {
    // 这里可以从服务器加载图片列表
    // 暂时使用模拟数据
    images = [
        '/images/banner1.png',
        '/images/banner2.png',
        '/images/banner3.png',
        '/images/宫保鸡丁.jpg',
        '/images/香辣鱿鱼须.jpg',
        '/images/新疆大盘鸡.jpg',
        '/images/玉米排骨汤.jpg',
        '/images/dish5.jpg',
        '/images/dish6.jpg',
        '/images/dish7.jpg',
        '/images/dish8.jpg'
    ];
    
    renderImageGrid();
}

// 渲染图片网格
function renderImageGrid() {
    elements.imageGrid.innerHTML = '';
    
    images.forEach(image => {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'image-item';
        
        imgDiv.innerHTML = `
            <img src="${image}" alt="${image}">
        `;
        
        imgDiv.addEventListener('click', () => selectImage(image));
        elements.imageGrid.appendChild(imgDiv);
    });
}

// 选择图片
function selectImage(image) {
    if (currentImageTarget === 'merchant') {
        elements.merchantImage.value = image;
        // 使用完整的URL进行预览
        elements.merchantImagePreview.src = image.startsWith('http') ? image : `http://localhost:3000${image}`;
    } else if (currentImageTarget === 'dish') {
        elements.dishImage.value = image;
        // 使用完整的URL进行预览
        elements.dishImagePreview.src = image.startsWith('http') ? image : `http://localhost:3000${image}`;
    }
    showToast('图片选择成功');
    closeImageSelector();
}

// 处理文件上传
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);
        
        // 显示加载状态
        showToast('正在上传图片...', 'info');
        
        // 上传文件到服务器
        axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            if (response.data.success) {
                const imagePath = response.data.image;
                if (currentImageTarget === 'merchant') {
                    elements.merchantImage.value = imagePath;
                    elements.merchantImagePreview.src = imagePath.startsWith('http') ? imagePath : `http://localhost:3000${imagePath}`;
                } else if (currentImageTarget === 'dish') {
                    elements.dishImage.value = imagePath;
                    elements.dishImagePreview.src = imagePath.startsWith('http') ? imagePath : `http://localhost:3000${imagePath}`;
                }
                showToast('图片上传成功');
                closeImageSelector();
            } else {
                showToast('图片上传失败', 'error');
            }
        })
        .catch(error => {
            console.error('上传图片失败:', error);
            showToast('图片上传失败', 'error');
        });
    }
}

// 显示提示框
function showToast(message, type = 'success') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.style.display = 'block';
    
    setTimeout(() => {
        elements.toast.style.display = 'none';
    }, 3000);
}

// 页面加载完成后初始化
window.addEventListener('load', init);

// 加载商家列表（用于订单分析）
function loadMerchantsForAnalytics() {
    axios.get(`${API_BASE_URL}/merchants`)
        .then(response => {
            const merchants = response.data;
            let options = '<option value="">所有商家</option>';
            merchants.forEach(merchant => {
                options += `<option value="${merchant.id}">${merchant.name}</option>`;
            });
            elements.analyticsMerchantFilter.innerHTML = options;
        })
        .catch(error => {
            console.error('加载商家列表失败:', error);
        });
}

// 加载分析数据
function loadAnalyticsData() {
    const timeFilter = elements.analyticsTimeFilter.value;
    const merchantId = elements.analyticsMerchantFilter.value;
    
    // 显示加载状态
    showToast('正在加载分析数据...', 'info');
    
    // 调用API获取真实数据
    axios.get(`${API_BASE_URL}/analytics`, {
        params: {
            timeFilter: timeFilter,
            merchantId: merchantId
        }
    })
    .then(response => {
        const data = response.data;
        // 初始化图表
        initCharts(data);
        
        // 隐藏加载状态
        setTimeout(() => {
            showToast('数据加载完成', 'success');
        }, 1000);
    })
    .catch(error => {
        console.error('获取分析数据失败:', error);
        // 显示错误信息
        showToast('获取数据失败，使用默认数据', 'error');
        
        // 使用默认数据
        const defaultData = {
            dishSales: {
                labels: ['宫保鸡丁', '新疆大盘鸡', '炸鸡排', '玉米排骨汤', '香辣鱿鱼须'],
                data: [120, 90, 150, 80, 110]
            },
            orderCompletion: {
                labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                data: [45, 52, 49, 60, 55, 30, 25]
            },
            merchantOrders: {
                labels: ['川菜馆', '粤菜餐厅', '西餐厅', '快餐店', '面馆'],
                data: [200, 150, 120, 180, 100]
            },
            orderType: {
                dineIn: 65,
                takeaway: 35
            }
        };
        
        initCharts(defaultData);
    });
}

// 初始化图表
function initCharts(data) {
    // 菜品销量图表
    const dishSalesChart = echarts.init(elements.dishSalesChart);
    dishSalesChart.setOption({
        title: {
            text: '菜品销量统计',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: data.dishSales.labels,
            axisLabel: {
                interval: 0,
                rotate: 30
            }
        },
        yAxis: {
            type: 'value',
            name: '销量'
        },
        series: [{
            data: data.dishSales.data,
            type: 'bar',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#83bff6' },
                    { offset: 0.5, color: '#188df0' },
                    { offset: 1, color: '#188df0' }
                ])
            }
        }]
    });
    
    // 订单完成量图表
    const orderCompletionChart = echarts.init(elements.orderCompletionChart);
    orderCompletionChart.setOption({
        title: {
            text: '订单完成量统计',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: data.orderCompletion.labels
        },
        yAxis: {
            type: 'value',
            name: '订单量'
        },
        series: [{
            data: data.orderCompletion.data,
            type: 'line',
            smooth: true,
            itemStyle: {
                color: '#52c41a'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(82, 196, 26, 0.5)' },
                    { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
                ])
            }
        }]
    });
    
    // 商家订单量对比图表
    const merchantOrdersChart = echarts.init(elements.merchantOrdersChart);
    merchantOrdersChart.setOption({
        title: {
            text: '商家订单量对比',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        xAxis: {
            type: 'category',
            data: data.merchantOrders.labels,
            axisLabel: {
                interval: 0,
                rotate: 30
            }
        },
        yAxis: {
            type: 'value',
            name: '订单量'
        },
        series: [{
            data: data.merchantOrders.data,
            type: 'bar',
            itemStyle: {
                color: function(params) {
                    const colors = ['#fad0c4', '#ff9e9e', '#ff7a7a', '#ff5252', '#ff1744'];
                    return colors[params.dataIndex % colors.length];
                }
            }
        }]
    });
    
    // 订单类型分布图表
    const orderTypeChart = echarts.init(elements.orderTypeChart);
    orderTypeChart.setOption({
        title: {
            text: '订单类型分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        series: [{
            type: 'pie',
            radius: '60%',
            data: [
                { value: data.orderType.dineIn, name: '堂食' },
                { value: data.orderType.takeaway, name: '外卖' }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            itemStyle: {
                color: function(params) {
                    const colors = ['#1890ff', '#52c41a'];
                    return colors[params.dataIndex];
                }
            }
        }]
    });
    
    // 响应式处理
    window.addEventListener('resize', function() {
        dishSalesChart.resize();
        orderCompletionChart.resize();
        merchantOrdersChart.resize();
        orderTypeChart.resize();
    });
}