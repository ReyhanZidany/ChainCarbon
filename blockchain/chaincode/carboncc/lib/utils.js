// chaincode/carboncc/lib/utils.js
async function get(ctx, k) {
    const data = await ctx.stub.getState(k);
    if (!data || data.length === 0) return null;
    return JSON.parse(data.toString('utf8'));
  }
  
  async function put(ctx, k, value) {
    await ctx.stub.putState(k, Buffer.from(JSON.stringify(value)));
  }
  
  const key = {
    company: id => `COMPANY:${id}`,
    project: id => `PROJECT:${id}`,
    cert:    id => `CERT:${id}`,
    retReq:  id => `RETREQ:${id}`
  };
  
  module.exports = { get, put, key };
