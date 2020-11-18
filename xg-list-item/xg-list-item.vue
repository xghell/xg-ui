<template>
	<!-- #ifdef APP-NVUE -->
	<cell>
		<slot></slot>
	</cell>
	<!-- #endif -->
	
	<!-- #ifndef APP-NVUE -->
	<view>
		<slot></slot>
	</view>
	<!-- #endif -->
</template>

<script>
	export default {
		
	}
</script>

<style lang="scss" scoped>

</style>