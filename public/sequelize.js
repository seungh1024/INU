
// 사용자 이름 눌렀을 때 댓글 로딩
document.querySelectorAll('#store-list tr').forEach((el) => {
    el.addEventListener('click', function () {
      const id = el.querySelector('td').textContent;
      getMenu(id);
      getOrder(id);
    });
  });
  // 사용자 로딩
  async function getUser() {
    try {
      const res = await axios.get('/users');
      const users = res.data;
      console.log(users);
      const tbody = document.querySelector('#user-list tbody');
      tbody.innerHTML = '';
      users.map(function (user) {
        const row = document.createElement('tr');
        // row.addEventListener('click', () => {
        //   getMenu(user.id);
        // });
        // 로우 셀 추가
        let td = document.createElement('td');
        td.textContent = user.id;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.name;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.pass ;
        row.appendChild(td);
        tbody.appendChild(row);
        
      });
    } catch (err) {
      console.error(err);
    }
  }
  //store 로딩
  async function getStore() {
    try {
      const res = await axios.get('/stores');
      const stores = res.data;
      console.log(stores);
      const tbody = document.querySelector('#store-list tbody');
      tbody.innerHTML = '';
      stores.map(function (store) {
        const row = document.createElement('tr');
        row.addEventListener('click', () => {
          getMenu(store.store_code);
          getOrder(store.store_code);
        });
        // 로우 셀 추가
        let td = document.createElement('td');
        td.textContent = store.store_code;//사업자 등록번호
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = store.status;//영업여부
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = store.table_cnt ;//테이블개수
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = store.latitude ;//위도
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = store.longitude ;//경도
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = store.category ;//카테고리
        row.appendChild(td);
        tbody.appendChild(row);
        
      });
    } catch (err) {
      console.error(err);
    }
  }
  // Menu 로딩
  async function getMenu(store_code) {
    try {
      const res = await axios.get(`/menus/${store_code}`);
      const menus = res.data;
      const tbody = document.querySelector('#menu-list tbody');
      tbody.innerHTML = '';
      menus.map(function (menu) {
        // 로우 셀 추가
        const row = document.createElement('tr');
        let td = document.createElement('td');
        td.textContent = menu.store_code;//사업자등록번호
        row.appendChild(td);
        td=document.createElement('td');
        td.textContent = menu.menu_name;//메뉴명
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = menu.price;//메뉴 가격
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = menu.sold;//품절여부
        const updatecode = td.textContent;//품절여부 담는 변수
        row.appendChild(td);

        const remove = document.createElement('button');
        remove.textContent = '삭제';
        remove.addEventListener('click', async () => { // 삭제 클릭 시
          try {
            await axios.delete(`/menus/${menu.store_code}/${menu.menu_name}/delete`);
            getMenu(store_code);
          } catch (err) {
            console.error(err);
          }
        });

        //수정버튼 만들기
        const edit = document.createElement('button');
        edit.textContent = '수정';
        edit.addEventListener('click', async () => { // 수정 클릭 시
          
          
          try {
            await axios.patch(`/menus/${menu.store_code}/${menu.menu_name}`);
            getMenu(store_code);
          } catch (err) {
            console.error(err);
          }
        });

        // 버튼 추가
        
        td = document.createElement('td');
        td.appendChild(remove);
        row.appendChild(td);
        td = document.createElement('td');//수정버튼
        td.appendChild(edit);
        row.appendChild(td);
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Order 로딩
  async function getOrder(store_code) {
    try {
      const res = await axios.get(`/orders/${store_code}`);
      const orders = res.data;
      const tbody = document.querySelector('#order-list tbody');
      tbody.innerHTML = '';
      orders.map(function (order) {
        // 로우 셀 추가
        const row = document.createElement('tr');
        let td = document.createElement('td');
        td.textContent = order.store_code;//사업자등록번호
        row.appendChild(td);
        td=document.createElement('td');
        td.textContent = order.menu_name;//메뉴명
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = order.menu_cnt;//메뉴 개수
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = order.table_num;//테이블번호
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = order.cook;//조리여부
        const updatecode = td.textContent;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = order.pay;//결제여부
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = order.date;//주문일시
        row.appendChild(td);
        

        //삭제버튼 만들기
        const remove = document.createElement('button');
        remove.textContent = '삭제';
        remove.addEventListener('click', async () => { // 삭제 클릭 시
          try {
            await axios.delete(`/orders/${order.store_code}/${order.table_num}/${order.menu_name}/${order.date}/delete`);
            getOrder(store_code);
          } catch (err) {
            console.error(err);
          }
        });
        //조리여부 수정버튼 만들기
        const edit = document.createElement('button');
        edit.textContent = '조리수정';
        edit.addEventListener('click', async () => { // 수정 클릭 시
          
          
          try {
            
            await axios.patch(`/orders/${order.store_code}/${order.table_num}/${order.menu_name}/${order.date}/cook`);
            getOrder(store_code);
          } catch (err) {
            console.error(err);
          }
        });
        //결제여부 수정버튼 만들기
        const pay = document.createElement('button');
        pay.textContent = '결제수정';
        pay.addEventListener('click', async () => { // 수정 클릭 시
          // var payComment= 0;
          // if(paycode =='0'){
          //   payComment =1;
          // }else{
          //   payComment =0;
          // }
          
          try {
            
            await axios.patch(`/orders/${order.store_code}/${order.table_num}/${order.menu_name}/${order.date}/pay`);
            getOrder(store_code);
          } catch (err) {
            console.error(err);
          }
        });
        //삭제,수정버튼 추가
        td = document.createElement('td');
        td.appendChild(remove);
        row.appendChild(td);
        //삭제버튼
        td = document.createElement('td');
        td.appendChild(edit);
        row.appendChild(td);
        //조리수정버튼
        td = document.createElement('td');
        td.appendChild(pay);
        row.appendChild(td);
        //결제수정버튼
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error(err);
    }
  }
  // 사용자 등록 시
  document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    const pass = e.target.age.value;
    const tablename = e.target.tablename.value;
    if (!name) {
      return alert('이름을 입력하세요');
    }
    if (!pass) {
      return alert('나이를 입력하세요');
    }
    if (!tablename) {
      return alert('가게 이름을 입력하세요');
    }

    try {
      await axios.post('/users', { name, pass,tablename });
      getUser();
    } catch (err) {
      console.error(err);
    }
    e.target.username.value = '';
    e.target.age.value = '';
    e.target.tablename.value = '';
  });
  //사용자 삭제 시
  document.getElementById('user-delete').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    if (!name) {
      return alert('이름을 입력하세요');
    }
    try {
      await axios.delete(`/users/${name}/delete`);
      getUser();
      getStore();
    } catch (err) {
      console.error(err);
    }
    e.target.username.value = '';
  });
  

  //store등록 시
  document.getElementById('store-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const store_code = e.target.store_code.value;
    const status = e.target.status.value;
    const table_cnt = e.target.table_cnt.value;
    const lat = e.target.latitude.value;
    const long = e.target.longitude.value;
    const category = e.target.category.value;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(long);
    if (!store_code) {
      return alert('사업자등록번호를 입력하세요');
    }
    if (!table_cnt) {
      return alert('테이블개수 입력하세요');
    }
    if (!latitude) {
      return alert('위도 입력하세요');
    }
    if (!longitude) {
      return alert('경도 입력하세요');
    }
    if(!category){
      return alert('카테고리 입력하세요');
    }
    
    
    try {
      await axios.post('/stores', { store_code, status,table_cnt,latitude,longitude,category });
      getUser();
      getStore();
    } catch (err) {
      console.error(err);
    }
    e.target.store_code.value = '';
    e.target.status0.checked = false;
    e.target.status1.checked = false;
    e.target.table_cnt.value = '';
    e.target.latitude.value ='';
    e.target.longitude.value='';
    e.target.category.value='';
  });
  //store 삭제 시
  document.getElementById('store-delete').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    if (!name) {
      return alert('이름을 입력하세요');
    }
    try {
      await axios.delete(`/stores/${name}/delete`);
      getStore();
      
    } catch (err) {
      console.error(err);
    }
    e.target.username.value = '';
  });
  //store 업데이트 시
  document.getElementById('store-update').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    if (!name) {
      return alert('이름을 입력하세요');
    }
    try {
      await axios.patch(`/stores/${name}/status`);
      getStore();
      
    } catch (err) {
      console.error(err);
    }
    e.target.username.value = '';
  });

  // menu 등록 시
  document.getElementById('menu-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const store_code = e.target.store_code.value;
    const menu_name = e.target.menu_name.value;
    const price = e.target.price.value;
    const sold = e.target.sold.value;
    if (!store_code) {
      return alert('사업자번호를 입력하세요');
    }
    if (!menu_name) {
      return alert('메뉴를 입력하세요');
    }
    if (!price) {
      return alert('가격을 입력하세요');
    }
    try {
      await axios.post('/menus', { store_code, menu_name, price, sold });
      
    
    } catch (err) {
      console.error(err);
    }
    e.target.store_code.value = '';
    e.target.menu_name.value = '';
    e.target.price.value = '';
    e.target.sold0.checked = false;
    e.target.sold1.checked = false;
  });

  //order 등록시
  document.getElementById('order-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const store_code = e.target.store_code.value;
    const menu_name = e.target.menu_name.value;
    const menu_cnt = e.target.menu_cnt.value;
    const table_num = e.target.table_num.value;
    const cook = e.target.cook.value;
    const pay = e.target.pay.value;
    if (!store_code) {
      return alert('사업자번호를 입력하세요');
    }
    if (!menu_name) {
      return alert('메뉴를 입력하세요');
    }
    if (!menu_cnt) {
      return alert('메뉴개수를 입력하세요');
    }
    if (!table_num) {
      return alert('테이블번호를 입력하세요');
    }
    try {
      await axios.post('/orders', { store_code, menu_name, menu_cnt, table_num, cook, pay});
      
    } catch (err) {
      console.error(err);
    }
    e.target.store_code.value = '';
    e.target.menu_name.value = '';
    e.target.menu_cnt.value = '';
    e.target.table_num.value = '';
    e.target.cook0.checked = false;
    e.target.cook1.checked = false;
    e.target.pay0.checked = false;
    e.target.pay1.checked = false;
  });