<template>
	<!-- #ifdef APP-NVUE -->
	<list :show-scrollbar="showScrollbar">
		<slot></slot>
	</list>
	<!-- #endif -->
	
	<!-- #ifndef APP-NVUE -->
	<scroll-view :show-scrollbar="showScrollbar" scroll-y="true" >
		<view>
			<slot></slot>
		</view>
	</scroll-view>
	<!-- #endif -->
</template>

<script>
	export default {
		props: {
			showScrollbar: {
				type: Boolean,
				default: true
			},
		},
	}
</script>

<style lang="scss" scoped>

</style>