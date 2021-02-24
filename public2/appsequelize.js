// 사용자 이름 눌렀을 때 댓글 로딩
document.querySelectorAll('#user-list tr').forEach((el) => {
    el.addEventListener('click', function () {
      const id = el.querySelector('td').textContent;
      //getMenu(id);
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
        td.textContent = user.pass ;
        row.appendChild(td);
        tbody.appendChild(row);
        
      });
    } catch (err) {
      console.error(err);
    }
  }
  
  
  // 사용자 등록 시
  document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = e.target.userid.value;
    const pass = e.target.pass.value;
    if (!id) {
      return alert('이름을 입력하세요');
    }
    if (!pass) {
      return alert('나이를 입력하세요');
    }

    try {
      await axios.post('/users', { id, pass });
      getUser();
    } catch (err) {
      console.error(err);
    }
    e.target.userid.value = '';
    e.target.pass.value = '';
  });
  //사용자 삭제 시
  document.getElementById('user-delete').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.userid.value;
    if (!name) {
      return alert('이름을 입력하세요');
    }
    try {
      await axios.delete(`/users/${name}/delete`);
      getUser();
    } catch (err) {
      console.error(err);
    }
    e.target.userid.value = '';
  });
  

  