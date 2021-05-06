const Sequelize=require('sequelize');

module.exports = class Menu extends Sequelize.Model{
    //모듈로 만들고 exports 함
    //User 모델은 Sequelize.Model을 확장한 클래스로 선언
    static init(sequelize){
        //static init과 static associate메서드가 있음
        //init은 테이블에 대한 설정을 함
        //associate는 다른 모델과의 관계를 적음
        return super.init({
            Store_code:{
                type:Sequelize.STRING(10),
                allowNull:false,
                primaryKey:true,
            },
            Menu_name:{//메뉴명
                type:Sequelize.STRING(10),
                allowNull:false,
                primaryKey:true,
            },
            Menu_price:{//가격
                type:Sequelize.INTEGER.UNSIGNED,
                allowNull:false,
            },
        
        },{
            sequelize,
            timestamps:false,
            underscored:false,
            modelName:'Menu',
            tableName:'menus',
            paranoid:false,
            charset:'utf8',
            collate:'utf8_general_ci',
        });

    }
    static associate(db){
        db.Menu.belongsTo(db.Store,{foreignKey:'Store_code',targetKey:'Store_code'});
        db.Menu.hasMany(db.Order,{foreignKey:'Store_code',targetKey:'Store_code'})
       }
};