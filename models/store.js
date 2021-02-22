const Sequelize=require('sequelize');

module.exports = class Store extends Sequelize.Model{
    //모듈로 만들고 exports 함
    //User 모델은 Sequelize.Model을 확장한 클래스로 선언
    static init(sequelize){
        //static init과 static associate메서드가 있음
        //init은 테이블에 대한 설정을 함
        //associate는 다른 모델과의 관계를 적음
        return super.init({
            store_code:{//사업자등록번호
                type:Sequelize.STRING(10),
                allowNull:false,
                primaryKey:true,
                
            },
            status:{//영업여부 0:영업안함 1:영업중
                type:Sequelize.INTEGER,
                allowNull:false,

            },
            table_cnt:{//테이블개수
                type:Sequelize.INTEGER.UNSIGNED,
                allowNull:false,
            },
            latitude:{//위도
                type:Sequelize.STRING(20),
                allowNull:false,
            },
            longitude:{//경도
                type:Sequelize.STRING(20),
                allowNull:false,
            },
        
            
            //super.init의 첫번째 인수가 테이블 칼럼에 대한 설정
        //두 번째 인수가 테이블 자체에 대한 설정임
        //시퀄라이즈는 알아서 id를 기본키로 연결함->id칼럼은 적어줄 필요가 없음.
        //나머지 칼럼의 스펙을 입력하는데 MYSQL테이블과 칼럼 내용이 일치해야 함
        //하지만 자료형은 조금 다름
        //VARCHAR는 STRING으로
        //INT는 INTEGER로 
        //TINYINT는 BOOLEAN으로 DATETIME은 DATE로 적음
        //INTEGER>UNSIGNED 는 UNSIGNED옵션이 적용된 정수
        //ZEROFILL옵션은 모자란 부분을 0으로 채우는?3자리인데 1자리 수가 들어오면 001이런식으로
        //allowNull:false는 NOT NULL옵션임 unique는 UNIQUE옵션
        //defaultValue는 (DEFAULT)
        //Sequelize.NOW 는 현재 시간을 의미
        },{
            sequelize,
            timestamps:false,
            underscored:false,
            modelName:'Store',
            tableName:'stores',
            paranoid:false,
            charset:'utf8',
            collate:'utf8_general_ci',
        });
        //sequelize: static init 메서드의 매개변수와 연결되는 옵션
        //db.sequelize 객체를 넣어야 함 나중에 model/index.js에서 연결함
        //timestamps:이 속성값이 true면 시퀄라이즈는 createAt,updateAt칼럼 추가함
        //각각 로우가 생성될 때와 수정될 때의 시간이 자동으로 입력됨
        //underscored:시퀄라이즈는 기본적으로 테이블명,칼럼명을 캐멀케이스(예:createdAt)로 만듦
        //이를 스네이크 케이스(예:created_at)로 바꾸는 옵션임
        //modelName:모델이름 설정 노드 프로젝트에서 사용함
        //tableName:실제 데이터베이스의 테이블 이름이 됨 기본적으로는 모델이름을 소문자 및 복수형으로 함
        //paranoid:true로 설정하면 deleteAt이라는 컬럼이 생김
        //로우를 삭제할 때 완전히 지워지지않고 생긴 칼럼에 지운 시각이 기록됨
        //로우를 조회하는 명령을 내리면 deleteAt의 값이 null인 로우(삭제되지 않았다는 뜻)를 조회함
        //나중에 로우를 복원하기 위해서 이런걸 쓰는 것
        //charset,collate:각각 utf8,utf8_general_ci로 설정해야 한글입력됨
        //이모티콘까지 입력하려면 utf8mb4,utf8_general_ci입력

    }
    static associate(db){
        db.Store.hasMany(db.Menu,{foreignKey:'store_code',sourceKey:'store_code'});
        //db.User.hasMany(db.Comment,{foreignKey:'commenter',sourceKey:'id'});
        //1:N 관계에서는 1에는 hasMany로 설정하면 알아서 JOIN함
        //N인 곳도 설정해줘야 함 belongsTo로 함
        //hasMany모델에선 sourceKey사용한다고 생각
        //foreignKey따로 설정안하면 모델명+기본키가 합쳐진 UserId가 foreignKey로 생성됨
    }
};