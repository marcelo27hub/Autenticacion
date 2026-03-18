const db = require("../config/database");

const User = {
    create: (email, password, rol = "usuario") => {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO users (email, password, rol) VALUES (?, ?, ?)",
                [email, password, rol],
                function(err) {
                    if(err) reject(err);
                    else resolve({ id: this.lastID, email, rol });
                }
            );
        });
    },

    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
                if(err) reject(err);
                else resolve(row);
            });
        });
    }
};

module.exports = User;