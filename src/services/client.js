const clients = [{id:1, username: "test", password: 'test'}];


const authenticate = async ({ username, password }) => {

    const client = clients.find(u => u.username === username && u.password === password);
    if(client) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

} 

module.exports = {
    authenticate
}
