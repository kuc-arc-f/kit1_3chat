<svelte:head>
	<title>Test</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script lang="ts">
import { goto } from '$app/navigation';
import LibDbSession from '$lib/LibDbSession';
import LibConfig from '$lib/LibConfig';

/**
* login
* @param
*
* @return
*/ 
const login = async function () {
    try {
        const password = document.querySelector<HTMLInputElement>('#password');
        const email = document.querySelector<HTMLInputElement>('#email');
        const item = {
            email: email?.value,
            password: password?.value,
        }
//console.log(item); 
        const res = await fetch(LibConfig.API_URL + "/users/login", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},      
            body: JSON.stringify(item),
        });
        const json = await res.json();
//console.log(json);   
        if (res.status != 200) {
        throw new Error(await res.text());
        }
        if (json.ret != 'OK') {
            alert("Error, login")
            return
        }
        const key = LibConfig.SESSION_KEY_USER;     
console.log(key, json.data);
        const user = json.data;
        user.password = "";
        await LibDbSession.set(key, user);
        //window.location.href = '/';	
        goto(`/`);
    } catch (error) {
        console.error(error);
    }  
}
</script>

<!-- MarkUp -->
<div class="text-column">
    <h1>Login</h1>
    <div class="form-group col-sm-6">
        <label>Email:
        </label><br />
        <input type="text" class="form-control" name="email" id="email" />
        <label>Password:
        </label>
        <input type="password" class="form-control" name="password" id="password" />
    </div>
    <hr />
    <button on:click={login} class="btn btn-primary">Login</button>
    <hr />	
    <hr />
    <a href="/users/create">[ User-Create ]
    </a>
</div>
