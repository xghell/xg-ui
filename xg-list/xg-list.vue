<template>
	<!-- #ifdef APP-NVUE -->
	<list :id="id" :show-scrollbar="showScrollbar">
		<slot></slot>
	</list>
	<!-- #endif -->
	
	<!-- #ifndef APP-NVUE -->
	<scroll-view :id="id" class="list" :show-scrollbar="showScrollbar" scroll-y="true" >
		<view>
			<slot></slot>
		</view>
	</scroll-view>
	<!-- #endif -->
</template>

<script>
	export default {
		props: {
			id: {
				type: String,
			},
			showScrollbar: {
				type: Boolean,
				default: true
			},
		},
	}
</script>

<style lang="scss" scoped>
	.list {
		/* #ifdef MP */
		height: 100%;
		/* #endif */
	}
</style>