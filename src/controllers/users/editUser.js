const getDB = require("../../database/db");

const editUser = async (req, res) => {
    try {
        const idUser = req.userInfo.id;
        const { email, name, pwd, newPwd} = req.body;
        
        const connect = await getDB();
        const [ pass ] = await connect.query(
            `
            SELECT SHA2(password,512) AS password
            FROM users
            WHERE id = ?
            `,
            [idUser]
        )

        if(pwd === pass[0].password) {
            if(email) {
                connect.query(
                `
                UPDATE users SET email = ?
                WHERE id = ?
                `,
                [email, idUser])
              };
          
              if(name) {
                connect.query(
                `
                UPDATE users SET name = ?
                WHERE id = ?
                `,
                [name, idUser])
              };
        }

        if(newPwd && newPwd !== pwd && pwd === pass[0].password)  {
            if(newPwd) {
                connect.query(
                `
                UPDATE users SET password = SHA2(?,512)
                WHERE id = ?
                `,
                [newPwd, idUser])
              };
        }

        if(pwd !== pass[0].password) {
            return res.send({
                status: "ERROR",
                message: "Contraseña incorrecta. Vuelve a introducirla."
            })
        }
          connect.release();
      
          res.status(200).send({
            status: "OK",
            message: "Usuario modificado correctamente",
            newUser: {
              userName: name,
              userEmail: email,
              userPassword: newPwd,
            }
            
          });
      
        } catch (error) {
          console.log(error);
        }
      };

module.exports = editUser;