import { dev } from '$app/environment';
//export const ssr = false;
import { error } from '@sveltejs/kit';
import LibAuth from '$lib/LibAuth';
import LibConfig from '$lib/LibConfig';
import LibDbSession from '$lib/LibDbSession';
console.log(LibConfig.API_URL);

//type
type TPostItem = {
  id: number,
  title: string,
  content: string,
  createdAt: string,
  categoryName: string, 
}
const getList = async function (): Promise<any> 
{
  try {   
    let postItem: any[] = [];
    const url = LibConfig.API_URL + "/chats/index";
    const response = await fetch(url);
    const json = await response.json();
    postItem = json.data;
//console.log(postItem);
    await LibDbSession.set(LibConfig.SESSION_KEY_CHAT_POST, postItem);
    return postItem;
  } catch (e) {
    console.error(e);
  }
}
//
/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    const validLogin: boolean = await LibAuth.validLogin();
      let items = [];
    if(validLogin !== false) {
      items = await getList();
    }
console.log(items);
    return {
      items: items,
      validLogin: validLogin,
    };
//    throw error(404, 'Not found');
  }
/*
title: 'Hello world!',
content: 'Welcome to our blog. Lorem ipsum dolor sit amet...',
*/