// 사용자 이름 눌렀을 때 댓글 로딩
document.querySelectorAll('#user-list tr').forEach((el) => {
    el.addEventListener('click', function () {
      const id = el.querySelector('td').textContent;
      getComment(id);
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
        row.addEventListener('click', () => {
          getComment(user.id);
        });
        // 로우 셀 추가
        let td = document.createElement('td');
        td.textContent = user.id;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.name;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.pass;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.married ? '기혼' : '미혼';
        row.appendChild(td);
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error(err);
    }
  }
  // 댓글 로딩
  async function getComment(userid) {
    try {
      const res = await axios.get(`/users/${userid}/change`);
      const comments = res.data;
      const tbody = document.querySelector('#comment-list tbody');
      tbody.innerHTML = '';
      comments.map(function (user) {
        // 로우 셀 추가
        const row = document.createElement('tr');
        let td = document.createElement('td');
        td.textContent = user.id;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.name;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.table_cnt;
        row.appendChild(td);
        const remove = document.createElement('button');
        remove.textContent = '삭제';
        remove.addEventListener('click', async () => { // 삭제 클릭 시
          try {
            await axios.delete(`/users/${user.id}/delete`);
            getComment(id);
          } catch (err) {
            console.error(err);
          }
        });
        // 버튼 추가
        
        td = document.createElement('td');
        td.appendChild(remove);
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
    const name = e.target.username.value;
    const pass = e.target.age.value;
    const tablename = e.target.tablename.value;
    const tablecount = e.target.tablecount.value;
    if (!name) {
      return alert('이름을 입력하세요');
    }
    if (!pass) {
      return alert('나이를 입력하세요');
    }
    try {
      await axios.post('/users', { name, pass,tablename,tablecount });
      getUser();
    } catch (err) {
      console.error(err);
    }
    e.target.username.value = '';
    e.target.age.value = '';
    e.target.tablecount.value = '';
    e.target.tablename.value = '';
  });
  // 댓글 등록 시
  document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = e.target.userid.value;
    const comment = e.target.comment.value;
    if (!id) {
      return alert('아이디를 입력하세요');
    }
    if (!comment) {
      return alert('댓글을 입력하세요');
    }
    try {
      await axios.post('/comments', { id, comment });
      getComment(id);
    } catch (err) {
      console.error(err);
    }
    e.target.userid.value = '';
    e.target.comment.value = '';
  });