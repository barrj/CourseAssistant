async function ask(account, aType, quest){
    try{
        const response = await fetch('http://20.169.159.21:21960/ask', {
              method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({
                    account: account,
                    aType: aType,
                    quest: quest
                })
        });
        const ans = await response.json();
        //console.log("doAsk received from server: " + ans);
        let res;
        let val;
        if (!(ans === "none")){
          //res = String.fromCharCode.apply(null, ans.data);
          //res = ans.data;
          res = ans;
          val = res.replace(/\n/g, "<br />");
          val = val.replace(/[\u0080-\u00FF]/g, " ");
          val = val.replace(/None from/g, "See");
          val = "<p>" + val + "</p>";
        }
        else{
            val = ans;
        }
        //console.log("doAsk is returning:\n\n" + val);
        return val;
    } catch (error){
        console.log("ask Could not fetch: " + error);
        return "fail";
    }
}


export default ask;
