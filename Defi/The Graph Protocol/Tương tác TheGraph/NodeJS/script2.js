const axios = require('axios');
const main = async () => {
    try{const result = await axios.post(
            "https://api.studio.thegraph.com/query/22198/subgraphforrandomassignment/v0.0.1",
            {
                query:`{
                  addressValues{
                    id
                    count
                  }
                }`}
        );
        console.log(result.data.data.addressValues);
    }catch(error){
        console.log(error);
    }
}
main();