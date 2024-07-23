async function newThread(account, aType, quest){
    try{
        const response = await fetch('http://20.169.159.21:21960/newthread', {
              method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({
                    account: account,
                    aType: aType,
                })
        });
        const ans = await response.json();
        console.log("doUpdateThread received from server: " + ans);
        return ans;
    } catch (error){
        console.log("updateThread Could not fetch: " + error);
        return "fail";
    }
}


export default newThread;
