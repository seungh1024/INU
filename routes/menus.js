const express = require('express');
const { Order } = require('../models');
const Menu = require('../models/menu');

const router = express.Router();


//db를 전면 개편함
//요청 대부분을 post로 하고 body에 Method값이 무엇이냐에 따라 서버에서 구분해서 처리하게 바꿈
router.post('/',async(req,res,next)=>{
  if(req.body.Method == "Get_menu"){
    try{
      const menu = await Menu.findAll({
        where:{Store_code:req.body.Store_code},
      })
      res.json(menu);
    }catch(err){
      console.error(err);
      next(err);
    }
  }
  
})

// router.delete('/:store_code/:menu_name/delete',async(req,res,next)=>{
//     try{
//         const menu = await Menu.destroy({
//           where:{ store_code:req.params.store_code,menu_name:req.params.menu_name }
//         });
//         res.json(menu);
//       }catch(err){
//         console.error(err);
//         next(err);
//       }
// });

// router.patch('/:store_code/:menu_name',async(req,res,next)=>{//메뉴 판매여부 업데이트
//     var cnt = 0;
//     try{
//         var menu = await Menu.findOne({
//             where:{store_code:req.params.store_code, menu_name: req.params.menu_name,}
//         })
//     }catch(err){
//         console.error(err);
//         next(err);
//     }
//     if(menu.sold == 0){
//         cnt =1;
//     }else{
//         cnt = 0;
//     }
//     try{
//         const result = await Menu.update({
//             sold:cnt,
//         },{
//             where:{store_code:req.params.store_code,menu_name:req.params.menu_name },
//         });
//         res.json(result);
//     }catch(err){
//         console.error(err);
//         next(err);
//     }
// });


module.exports = router;