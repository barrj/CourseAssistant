// This module exists to test that the /profile route is working
// on the server.  It is called from testProfile.js
exports.getProfile = async function (account){
    try{
        console.log("getProfile is calling server with account " + account);
        const response = await fetch('http://20.169.159.21:21958/profile', {
              method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({
                    account: account,
                })
        });
        const data = await response.json();
        console.log("getProfile received from server: " + data);
        console.log("getProfile received name from server: " + data[0].full_name);
        return data;
    } catch (error){
        console.log("Could not fetch: " + error);
        return [{full_name: "fail"}];
    }
  };
