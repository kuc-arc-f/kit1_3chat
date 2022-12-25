<svelte:head>
	<title>Test</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script lang="ts">
import LibDbSession from '$lib/LibDbSession';
import LibConfig from '$lib/LibConfig';

/**
* addItem
* @param
*
* @return
*/ 
const addItem = async function () {
	try {
//console.log(name);
    const name = document.querySelector<HTMLInputElement>('#name');
    const password = document.querySelector<HTMLInputElement>('#password');
    const email = document.querySelector<HTMLInputElement>('#email');
    const item = {
      name: name?.value,
      email: email?.value,
      password: password?.value,
    }
    const url = LibConfig.API_URL + "/users/add";
		const res = await fetch(url, {
			method: 'POST',
      headers: {'Content-Type': 'application/json'},      
			body: JSON.stringify(item),
		});
    const json = await res.json();
console.log(json);   
    if (res.status != 200) {
      throw new Error(await res.text());
    }     
    window.location.href = '/login'
  } catch (error) {
    console.error(error);
  }	
}
</script>

<!-- MarkUp -->
<div class="text-column">
	<h1>User Create</h1>
	<hr />
	<div class="form-group col-sm-6">
	  <label>Name:
	  </label><br />
	  <input type="text" class="form-control" name="name" id="name" />
	  <label>Email:
	  </label><br />
	  <input type="text" class="form-control" name="email" id="email" />
	  <label>Password:
	  </label>
	  <input type="password" class="form-control" name="password" id="password" />
	</div>
	<hr />
	<button on:click={addItem} class="btn btn-primary">Create
	</button>
</div>
