const clients = [{id:1, username: "test", password: 'test', role: 'user'},{id:2, username: "test2", password: 'test2', role: 'admin'}];

const verifyUser = ({ username, password }) => {
    
        const user = clients.find(u =>  u.username === username && u.password === password);
        if(user) {
            const { password, ...onlyUser } = user;
            return onlyUser;
        }
} 

module.exports = {
    verifyUser
}
