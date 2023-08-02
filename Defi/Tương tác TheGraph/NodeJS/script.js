// # The Graph / Tương tác với graph như http bth
const axios = require('axios');
const main = async () => {
    try{
        const result = await axios.post(
            "https://api.thegraph.com/subgraphs/name/hieucuopbien123/newsubgraph",
            {
                query:`{
                  addresses(orderDirection: asc,
                    orderBy: currentValue,
                    skip: 1
                    where:{ blockNumber_gt: 10228285,
                      currentValue_lte: 10,
                      currentValue_gte: 5}) {
                    id
                    currentValue
                    blockNumber
                  }
                }`
            },
            {
                headers: {
                  'Content-Type': 'application/json'
                }
            }
        );
        console.log(result.data.data.addresses);
    }catch(error){
        console.log(error);
    }
}
main();