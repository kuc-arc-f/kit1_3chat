<svelte:head>
	<title>Posts</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script lang="ts">
import LibConfig from '$lib/LibConfig';

/** @type {import('./$types').PageData} */
export let data: any, chat_posts: any[] = [];
console.log("[id]start");
console.log(data);
chat_posts = data.chat_posts;
/**
* addItem
* @param
*
* @return
*/
async function addItem(){
  try {
    const elemBody = document.querySelector<HTMLInputElement>('#body');
    const item = {
      title: '',
      chatId: Number(data.id),
      body: elemBody?.value,
      userId : Number(0),
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
//    await proc_update()
  } catch (error) {
    console.error(error);
  }    
}
</script>

<!-- MarkUp -->
<div class="container my-2">
	<a href={`/chats`} class="btn">[ Back ]
	</a>		
	<h1>{data.id}</h1>
	ID: {data.id}
	<hr />
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
	<hr />
	{#each chat_posts as item}
		<div>
			<p>{item.body}</p>
			<p>{item.createdAt}, ID: {item.id}</p>
			<hr />
		</div>
	{/each}  	
</div>
<!-- 	<div>{@html data.content}</div>
--->