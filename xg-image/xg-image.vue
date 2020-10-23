<template>
	<image :style="{width: widthInner + 'px', height: heightInner + 'px'}" :src="src" :mode="mode" :animation="animation" @load="load" @tap="tap"></image>
</template>

<script>
	/**
	 * @load
	 * @imageTap
	 */
	export default {
		name: 'XgImage',
		props: {
			animation: {
				type: Object
			},
			width: {
				type: String,
				default: '300rpx'
			},
			height: {
				type: String,
				default: '300rpx'
			},
			src: {
				type: String,
			},
			mode: {//'widthFix', 'heightFix'
				type: String,
			}
		},
		data() {
			return {
				// widthInner: 0,
				// heightInner: 0,
				
				ratio: -1, //height/width
			}
		},
		computed: {
			widthInner() {
				let width = this.toPx(this.width);
				if ('heightFix' === this.mode && this.ratio !== -1) {
					width = this.heightInner/this.ratio;
				}
				return width;
			},
			heightInner() {
				let height = this.toPx(this.height);
				if ('widthFix' === this.mode && this.ratio !== -1) {
					height = this.ratio*this.widthInner;
				}
					
				return height;
			}
		},
		created() {
			
		},
		methods: {
			/**
			 * 将rpx或px转换为px单位
			 * @param {String} vaule
			 */
			toPx(value) {
				const result = /(\d+\.?\d*)(\w*)/.exec(value);
				if (result&&result[1]) {
					if (result[2]) {
						if ('rpx' === result[2].trim()) {
							return uni.getSystemInfoSync().screenWidth * Number(result[1]) / 750;
						} else {
							return Number(result[1]);
						}
					} else {
						return Number(result[1]);
					}
				}
				
				throw new TypeError(`${value}单位格式不正确`);
			},
			
			load(e) {
				// console.log(e);
				const width = e.detail.width;
				const height = e.detail.height;
				
				this.ratio = height/width;
				
				e.detail.height = this.heightInner;
				e.detail.width = this.widthInner;
				
				this.$emit('load', e)
			},
			tap(e) {
				this.$emit('imageTap', e);
			}
		},
	}
</script>

<style lang="scss" scoped>

</style>