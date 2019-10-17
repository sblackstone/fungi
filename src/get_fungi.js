import { default as request } from 'request-promise-native';


let fungiCache = null;

export async function getFungi() {
  if (fungiCache === null) {
    fungiCache = await request("https://cdkstack-fungibucket822f5406-156dgl69y3n56.s3.amazonaws.com/fungi.json");
  }
  return(fungiCache);
}


export default getFungi;