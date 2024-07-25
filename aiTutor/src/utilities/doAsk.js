async function ask(account, aType, quest, files){
    try{

    const formData = new FormData();
    formData.append("quest", quest);
    formData.append("account", account);
    formData.append("aType", aType);
    for(let i =0; i < files.files.length; i++) {
        formData.append("files", files.files[i]);
        //console.log("doAsk received " + files.files[i].name);
    }
        /*
    console.log("addFiles, listing of FormData:");
    for (const entry in formData.entries()) {
      console.log(entry[0], entry[1], entry[2], entry[3]);
    }
    */

        const response = await fetch('http://20.169.159.21:21962/ask', {
              method: "post",
              body: formData,
            /*
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
            */
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
