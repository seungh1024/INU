const express = require('express');
const User = require('../models/user');
const Store = require('../models/store');
const  Menu  = require('../models/menu');

const router = express.Router();

router.route('/')// stores/로 get방식일 때
 .get(async (req, res, next) => {
    try {
      const stores = await Store.findAll({
        // include:{
        //   model:User
        // },
        // //where:{store_code:1},
      });
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

router.get('/:store_code', async (req, res, next) => {//사업자 번호로 가게를 찾을 때
    try {
      const store = await Store.findOne({
          where:{ store_code: req.params.store_code },
        
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
//가게명 까지 같이 알려주는 get방식 라우터 특정가게 값만 불러옴
router.get('/:store_code/store_name',async(req,res,next)=>{
  try{
    const store = await Store.findAll({
      include:{
        model:User,
        attributes:[
          ['name','name'],
          //attributes로 가게명만 추출해줌
          //['속성명','별칭']
        ]
      },
      where:{store_code:req.params.store_code},
    })
    res.json(store);
  }catch(err){
    console.error(err);
    next(err);
  }
});

//가게명 까지 같이 알려주는 get방식 라우터로 모든 가게를 다 가져옴
router.get('/stores/getall',async(req,res,next)=>{
  try {
    const stores = await Store.findAll({
      include:{
        model:User,
        attributes:[
          ['name','name'],
          //attributes로 가게명만 추출해줌
          //['속성명','별칭']
        ]
      },
    });
    res.json(stores);
  } catch (err) {
    console.error(err);
    next(err);
  }
})

//삭제시
router.delete('/:store_code/delete',async(req,res,next)=>{
    try{
      const store = await Store.destroy({
        where:{store_code:req.params.store_code}
      });
      res.json(store);
    }catch(err){
      console.error(err);
      next(err);
    }
  });

router.get('/:store_code/menus', async (req, res, next) => {
    //해당 가게의 메뉴들을 전부 찾는 라우터
  try {
    const menus = await Menu.findAll({
      include: {
        model: Store,
        where: { store_code: req.params.id },
      },
    });
    //findAll메서드에 옵션이 추가됨
    //include 옵션에서 model속성에는 User모델을, where속성에는 :id로 받은 아이디 값을 넣음
    //include model:User를 했으니 댓글을 가져오면서 User의 정보도 들고오는 것
    //:id는 라우트 매개변수(6.3절에 있음)
    //req.params.id로 값을 가져올 수 있음
    //req.params는 get request의 URL에서 :(콜론)뒤에 오는 파라미터를 가져올 때(파싱) 사용
    //단 실제 URL에서 콜론이 입력되지는 않음.
    //만약 GET/users/1/comments라면 사용자 아이디가 1인 댓글을 불러옴
    console.log(comments);
    res.json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch('/:store_code/status',async(req,res,next)=>{
    //가게코드와 해당 테이블 번호의 모든 status값을 0,1로 변환
    var cnt = 0;
    var change = await Store.findOne({
        where:{store_code:req.params.store_code},
    });
    if(change.status == 0){
        cnt =1;
    }else{
        cnt = 0;
    }
    try{
        const result = await Store.update({
            status:cnt,
            
        },{
            where:{store_code:req.params.store_code  },
        });
        res.json(result);
    }catch(err){
        console.error(err);
        next(err);
    }

})

  module.exports = router;