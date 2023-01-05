import { connect } from '../../utils/api.utils';

export default async function handler(req, res) {
  
  const {client, db} = await connect('campaign_factory')

  if(req.method === 'GET'){
    try{
      const currentLatest = await db.collection('campaign_factory').findOne({
        is_most_recent: true
      })
      return res.status(200).json({ contract: currentLatest})
    }catch(err){
      console.error('UNABLE TO SAVE CONTRACT!!! ❌❌❌❌❌ ERROR: ==>>> ', err)
      res.status(500).json({
        message: 'unable to get contract!',
        contract: null
      })
    }finally{
      await client.close()
    }
  }
}