<svelte:head>
	<title>Posts</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script lang="ts">
import LibConfig from '$lib/LibConfig';
import LibAuth from '$lib/LibAuth';
import { goto } from '$app/navigation';

/** @type {import('./$types').PageData} */
export let data;
console.log(data);

/**
 * addPost
 * @param
 *
 * @return
 */ 
const addPost = async function () {
console.log("add");
	try{
		const name = document.querySelector<HTMLInputElement>('#name');
		const url = LibConfig.API_URL + "/chats/create";
console.log(url);
		const item = {
		name: name?.value,
		content : '',
		userId:  0,
		}
		const body = JSON.stringify(item);		
		const res = await fetch(url, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},      
			body: body
		});
		const json = await res.json()
//console.log(json);   
		if (res.status != 200) {
			throw new Error(await res.text());
		}
		goto(`/chats`)
	} catch (e) {
      console.error(e);
      alert("error, add");
    }
}
</script>

<!-- MarkUp -->
<div class="container my-2">
	<a href={`/chats`} class="btn">[ Back ]
	</a>		
	<h1>Create</h1>
	<hr />
	<div class="col-sm-6">
		<label>Name:</label>
        <input type="text" name="name" id="name" class="form-control"
           />		
	</div>
	<button on:click={addPost} class="btn btn-primary my-2">Add</button>
	<hr />
</div>
