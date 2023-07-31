const getDB = require('../../database/db');

const postUser = async (req,res) => {
    try {
        const {email, name, pwd, avatar} = req.body;
        const connect = await getDB();

        const [userExist] = await connect.query(
            `SELECT id FROM users WHERE email=?`,[email]
        );

        if(userExist.length > 0){
            return res.status(409).send({
                status: 'ERROR',
                message: 'El usuario ya existe'
            });
        }

        const [users] = await connect.query(
            `INSERT INTO users (email, name, password, avatar) VALUES (?,?,SHA2(?,512),?)`,[email,name,pwd,avatar]
        );

        connect.release();
        
        res.status(200).send({
            status: 'OK',
            message: 'Usuario creado correctamente'
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports=postUser;