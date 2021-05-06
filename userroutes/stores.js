const express = require('express');
const Store = require('../models/store');
const  Menu  = require('../models/menu');

const router = express.Router();

router.route('/')// stores/로 get방식일 때
 .get(async (req, res, next) => {
    try {
      const stores = await Store.findAll();
      res.json(stores);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {//post방식일 때
    console.log(req.body);
    try {
      const store = await Store.create({//사용자 추가를 하는 것
        store_code: req.body.store_code,
        status: req.body.status,
        table_cnt: req.body.table_cnt,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        category:req.body.category,

      });
    //post 요청의 body(html 파일 보면 있음)의 값을 파싱(가져올 때) 사용함
    //.body.name 이렇게 이름이 붙은 이유는 <body>에 있는 값을 
    //sequelize.js에서 받아서 name,age,married로 user.js로 넘겨줬기 때문
      console.log(store);
      res.status(201).json(store);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.get('/:id', async (req, res, next) => {//사업자 번호로 가게를 찾을 때
    try {
      const store = await Store.findOne({
          where:{ store_code: req.params.id },
        
      });
      //findAll메서드에 옵션이 추가됨
      //include 옵션에서 model속성에는 User모델을, where속성에는 :id로 받은 아이디 값을 넣음
      //include model:User를 했으니 댓글을 가져오면서 User의 정보도 들고오는 것
      //:id는 라우트 매개변수(6.3절에 있음)
      //req.params.id로 값을 가져올 수 있음
      //req.params는 get request의 URL에서 :(콜론)뒤에 오는 파라미터를 가져올 때(파싱) 사용
      //단 실제 URL에서 콜론이 입력되지는 않음.
      //만약 GET/users/1/comments라면 사용자 아이디가 1인 댓글을 불러옴
      console.log(store);
      res.json(store);
      
    } catch (err) {
      console.error(err);
      next(err);
    }
});


//삭제시
router.delete('/:id/delete',async(req,res,next)=>{
    try{
      const store = await Store.destroy({
        where:{store_code:req.params.id}
      });
      res.json(store);
    }catch(err){
      console.error(err);
      next(err);
    }
  });

router.get('/:store_code/menus', async (req, res, next) => {
  try {
    const menus = await Menu.findAll({
      include: {
        model: Store,
        where: { store_code: req.params.id },
      },
    });
    console.log(comments);
    res.json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

  module.exports = router;