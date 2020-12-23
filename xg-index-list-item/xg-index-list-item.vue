<template>
	<view ref="index-list-item" id="index-list-item">
		<slot></slot>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom');
	// #endif
	
	export default {
		inject: ['_indexList'],
		data() {
			return {
				
			}
		},
		created() {
			
		},
		mounted() {
			this.$nextTick(function(){
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['index-list-item'], data => {
					// console.log(data.size);
					this._indexList.childrenRects.push(data.size);
				})
				// #endif
				
				// #ifndef APP-NVUE
				const query = uni.createSelectorQuery().in(this);
				
				query.select('#index-list-item').fields({rect: true});
				query.exec(data => {
					// console.log(data[0]);
					this._indexList.childrenRects.push(data[0]);
				})
				// #endif
			})
		},
		methods: {
		},
	}
</script>

<style lang="scss">

</style>