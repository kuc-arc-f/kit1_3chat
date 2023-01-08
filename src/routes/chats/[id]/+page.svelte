<svelte:head>
<title>Posts</title>
<meta name="description" content="About this app" />
</svelte:head>

<script lang="ts">
import LibConfig from '$lib/LibConfig';
import LibAuth from '$lib/LibAuth';
import LibCommon from '$lib/LibCommon';
import LibChatPost from '$lib/LibChatPost';
import LibTimer from '$lib/LibTimer';
import ChatPost from '../ChatPost';
import ModalPost from './ModalPost.svelte';
//
const postCfg= LibChatPost.get_params()
const chatParams = {
  INIT_TIME : new Date(),
  STAT : postCfg.STATE_ACTIVE,
  STAT_DISPLAY : postCfg.STATE_DISPLAY_ACTIVE,
  REMAIN_TIME : 0,
}
/** @type {import('./$types').PageData} */
export let data: any, chat_posts: any[] = [], DATA = chatParams,
post_id = 0, modal_display = false, mTimeoutId: any = 0, user:any = {};
//
console.log("[id]start");
user = data.user;
chat_posts = data.chat_posts;
//console.log(user.id);
/**
* timer_func
* @param
*
* @return
*/  
const timer_func = async function(){
  const sec = LibChatPost.get_remain_time(DATA.INIT_TIME, new Date() )
  const valid = LibChatPost.valid_update(sec, DATA.STAT)
  DATA.REMAIN_TIME = LibChatPost.get_next_time(sec)
  const timeoutId = LibTimer.getTimeoutId();
//console.log("timeoutId=", timeoutId);
  if(valid){
    DATA.INIT_TIME = new Date()
    //user.id
    proc_update()
  }
  timeout_next();
  if(typeof window !== 'undefined' ){
    console.log(DATA.STAT, sec, valid);
  }
};
/**
* timeout_next
* @param
*
* @return
*/
function timeout_next(){
  mTimeoutId = setTimeout(timer_func, 5000 );
  LibTimer.setTimeoutId(mTimeoutId);
}
/**
* proc_update
* @param
*
* @return
*/
const proc_update = async function ()
{
    try{
        const items = await ChatPost.getList(data.id);
console.log(items);
        chat_posts = items;
    } catch (e) {
    console.error(e);
    throw new Error('Error , proc_update');
    }
// /console.log(json)	
}
/**
* init proc: 開始
* @param
*
* @return
*/
if(data.validLogin === false) {
    window.location.href = '/login';
}
//
const timeoutId = LibTimer.getTimeoutId();
if(timeoutId !== null) {
  LibTimer.clearTimer(timeoutId);
}
timeout_next()
/**
* addItem
* @param
*
* @return
*/
async function addItem(){
    try {
        const user = await LibAuth.getUser()
        if(user === null) {
            console.error("addPost, user nothing");
            throw new Error('Error , user nothing');
        }
//console.log(user);
        const elemBody = document.querySelector<HTMLInputElement>('#body');
        const item = {
            title: '',
            chatId: Number(data.id),
            body: elemBody?.value,
            userId : Number(user.id),
        }
        console.log(item);
        const url = LibConfig.API_URL + '/chat_posts/create';
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',},
            body: JSON.stringify(item),
        });
        if (res.status != 200) {
            throw new Error(await res.text());
        }
        //@ts-ignore
        elemBody.value = "";
        console.log(await res.json())
        await proc_update()
    } catch (error) {
        console.error(error);
    }    
}
/**
 * parentShow
 * @param
 *
 * @return
 */
const parentShow = function (id: number)
{
    try {
        post_id = id;
        modal_display = false;
        const timer = 100;
        setTimeout(() => {
            console.log("parentShow=", id);
            modal_display = true;
            const btn = document.getElementById("open_post_show");
            btn?.click();
        }
        , timer);
    } catch (e) {
        console.log(e);
    }
}
</script>

<!-- CSS -->
<style>
.chat_show_modal_wrap #open_post_show { display: none ;}
</style>

<!-- MarkUp -->
<div class="container my-2">
    <h1>{data.id}</h1>
    ID: {data.id}
    <hr class="my-1" />
    <div class="row">
        <div class="col-sm-9">
        <textarea class="form-control" name="body" id="body" rows="3" />
        </div>
        <div class="col-sm-3">
            <button class="mt-2 btn btn-outline-primary" on:click={addItem} >
            Post</button>
        </div>
    </div>
    <hr class="my-1" />
    {#each chat_posts as item}
    <div>
        <h5>{item.UserName}</h5>
        <hr class="my-1" />
        <p>{@html LibCommon.replaceBrString(item.body)}</p>
        <p>{LibCommon.converDateString(item.createdAt)}, ID: {item.id}
        </p>
        <button on:click={parentShow(item.id)}
        class="btn btn-sm btn-outline-primary">Show</button>
        <hr />
    </div>
    {/each}  
    <!-- Modal -->
    <div class="chat_show_modal_wrap">
        <button type="button" class="btn btn-primary" id="open_post_show"
        data-bs-toggle="modal" data-bs-target="#exampleModal">Launch demo modal
       </button>
        <div class="modal fade" id="exampleModal" tabindex="-1"
          aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    {#if modal_display}
                    <ModalPost post_id={post_id}  />
                    {/if}
                </div>
            </div>
        </div>    
    </div>
</div>

<!--
<a href={`/chats`} class="btn">[ Back ]
</a>		
<p>{convertBodyText(item.body)}
<p>{item.createdAt}, ID: {item.id}</p>
</p>
--->
