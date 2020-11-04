<template>
	<div class="m-2 text-center">
		<h2>Dziękujemy!</h2>
		<p>Dziękujemy za złożenie zamówienia o identyfikatorze {{orderId}}.</p>
		<p>Dostarczymy wybrane produkty tak szybko, jak to możliwe.</p>
		<router-link to="/" class="btn btn-primary">Powrót do sklepu</router-link>
	</div>
</template>
<script>
	export default {
		computed: {
			orderId() {
				return this.$route.params.id;
			}
		} 
	}
</script>
