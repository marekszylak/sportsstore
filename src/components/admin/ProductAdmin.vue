<template>
	<div>
		<router-link to="/admin/products/create" class="btn btn-primary m-2">
			Utwórz produkt
		</router-link>
		<table class="table table-sm table-bordered">
			<thead>
				<th>ID</th>
				<th>Nazwa</th>
				<th>Kategoria</th>
				<th class="text-right">Cena</th>
				<th></th>
			</thead>
			<tbody>
				<tr v-for="p in products" v-bind:key="p.id">
					<td>{{ p.id }}</td>
					<td>{{ p.name }}</td>
					<td>{{ p.category }}</td>
					<td class="text-right">{{ p.price | currency }}</td>
					<td class="text-center">
						<button class="btn btn-sm btn-danger mx-1" v-on:click="removeProduct(p)">
							Usuń
						</button>
						<button class="btn btn-sm btn-warning mx-1" v-on:click="handleEdit(p)">
							Edytuj
						</button>
					</td>
				</tr>
			</tbody>
		</table>
		<page-controls />
	</div>
</template>
<script>
import PageControls from "../PageControls"
import { mapGetters, mapActions } from "vuex"
export default {
	components:{
		PageControls
	},
	computed:{
		...mapGetters({
			products: "processedProducts"
		})
	},
	methods:{
		...mapActions(["removeProduct"]),
		handleEdit(product) {
			this.$router.push(`/admin/products/edit/${product.id}`)
		}
	}
}
</script>