<template>
	<view class="picker-region">
		<view class="header">
			<text class="header-text">请选择所在地区</text>
		</view>
		<!-- <view class="country-option-list">
			<view class="country-option">
				<text class="country-option-text">中国大陆</text>
				<view class="title-line"></view>
			</view>
		</view> -->
		
		<view class="current-address-section">
			<view class="current-address-item" @tap="onCurrentAddressItemTap('province', currentProvince)">
				<text :class="{'current-address-item-text-selected': currentAddressItemIndex === 'province'}" class="current-address-item-text">{{currentProvince && currentProvince.name}}</text>
			</view>
			<view class="current-address-item" @tap="onCurrentAddressItemTap('city', currentCity)">
				<text :class="{'current-address-item-text-selected': currentAddressItemIndex === 'city'}" class="current-address-item-text">{{(currentCity && currentCity.name) || (currentProvince && currentProvince.name ? '请选择' : '')}}</text>
			</view>
			<view class="current-address-item" @tap="onCurrentAddressItemTap('area', currentArea)">
				<text :class="{'current-address-item-text-selected': currentAddressItemIndex === 'area'}" class="current-address-item-text">{{(currentArea && currentArea.name) || (currentCity && currentCity.name ? '请选择' : '')}}</text>
			</view>
		</view>
		
		<view class="address-section">
			<view class="address-list-wrap" >
				<xg-index-list class="address-list" :current="currentContentIndex" @change="onIndexListChange" @scroll="onIndexListScroll">
					<template slot="header" v-if="!currentProvince">
						<view class="hot-city-list">
							<view class="hot-city-title">
								<text class="hot-city-title-text">热门城市</text>
							</view>
							<view class="hot-city-content">
								<uni-grid :highlight="false" :show-border="false" :square="false" :column="4">
									<uni-grid-item v-for="(hotCity, hotCityIndex) of hotCitysInner" :key="hotCityIndex">
										<view class="hot-city-item">
											<text class="hot-city-item-text">{{hotCity&&hotCity.name}}</text>
										</view>
										
									</uni-grid-item>
								</uni-grid>
							</view>
						</view>
					</template>
					<xg-index-list-item v-for="(group, groupIndex) of indexList" :key="groupIndex">
						<view class="address-group">
							<view class="address-group-name border-bottom">
								<text class="address-group-name-text">{{groupIndex}}</text>
							</view>
							<view class="address-group-content">
								<view class="address-group-item" v-for="(item, itemIndex) of group" :key="itemIndex" @tap="onAddressItemTap(item)">
									<text class="address-group-item-text">{{item.name}}</text>
								</view>
							</view>
						</view>
					</xg-index-list-item>
				</xg-index-list>
			</view>
			<view class="address-index-wrap">
				<view class="address-index">
					<view class="address-index-item" v-for="(title, index) of indexTitles" :key="index" @tap="onTitleTap(index)">
						<text :class="{'address-index-item-text-selected': currentTitleIndex === index}" class="address-index-item-text">{{title}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from './config';
	
	import provinces from './city-data/province.js'	
	import citys from './city-data/city.js'	
	import areas from './city-data/area.js'	
	import hotCitys from './city-data/hot-city.js'	
	
	
	/**
	 * @event {Function()} confirm 
	 */
	export default {
		mixins: [config],
		props: {
			hotCityColumn: {
				type: Number,
				default: 3
			},
			hotCitys: {
				type: Array,
			},
			provinces: {
				type: Array,
			},
			citys: {
				type: Array,
			},
			areas: {
				type: Array,
			},
		},
		data() {
			return {
				allProvinces: [],
				allCitys: [],
				allAreas: [],
				
				indexList: [],
				address_code: '000000',
			}
		},
		computed: {
			hotCitysInner() {
				return this.hotCitys||hotCitys;
			},
			provinceOptions() {
				return this.allProvinces;
			},
			cityOptions() {
				const province_code = this.address_code.slice(0, 2);
				const citys = this.allCitys.filter(city => {
					return city.code.slice(0,2) === province_code;
				});
				
				return citys;
			},
			areaOptions() {
				const city_code = this.address_code.slice(0, 4);
				
				const areas = this.allAreas.filter(area => {
					return area.code.slice(0, 4) === city_code;
				});
				
				return areas;
			},

			indexTitles() {
				return Object.keys(this.indexList).map(key => key);
			},
			
			currentProvince() {
				return this.allProvinces.find((province) => {
					return this.address_code.slice(0, 2).localeCompare(province.code.slice(0, 2)) === 0
				})
			},
			currentCity() {
				return this.allCitys.find((city) => {
					return this.address_code.slice(0, 4).localeCompare(city.code.slice(0, 4)) === 0;
				});
			},
			currentArea() {
				return this.allAreas.find((area) => {
					return this.address_code.slice(0, 6).localeCompare(area.code.slice(0, 6)) === 0;
				})
			}
		},
		created() {
			this.allProvinces = this.provinces||provinces;
			this.allCitys = this.citys||citys;
			this.allAreas = this.areas||areas;
			
			
			this.setIndexList(this.provinceOptions);
		},
		
		methods: {
			onCurrentAddressItemTap(index, item) {
				this.setCurrentAddressItemIndex(index);
				
				if (index === 'province') {
					this.setIndexList(this.provinceOptions);
					return ;
				}
				if (index === 'city') {
					this.setIndexList(this.cityOptions);
					return ;
				}
				if (index === 'area') {
					this.setIndexList(this.areaOptions);
					return ;
				}
			},
			
			
			setIndexList(list) {
				this.indexList = this.orderBy(list, 'pinyin');
			},
			orderBy(collection, field) {
				const res = {};
				
				collection.sort((doc1, doc2) => {
					return doc1[field].localeCompare(doc2[field]);
				}).forEach(doc => {
					doc[field].toUpperCase();
					
					const first_char = doc[field][0];
					
					if (!res[first_char]) {
						res[first_char] = []
					}
						
					res[first_char].push(doc);
				})
				
				return res;
			},
			
			onIndexListChange(e) {
				const index = e.detail.current;
				this.setCurrentTitleIndex(index);
				this.setOldCurrentContentIndex(index);
			},
			onTitleTap(index) {
				this.setCurrentContentIndex(index);
			},
			
			onAddressItemTap(item) {
				this.setCurrentContentIndex(0);
				
				this.address_code = item.code;
				
				if (this.address_code.slice(4, 6) !== '00') {
					this.setIndexList(this.areaOptions);
					this.setCurrentAddressItemIndex('area');
					
					this.$emit('confirm', {
						detail: {
							province: this.currentProvince,
							city: this.currentCity,
							area: this.currentArea,
						}
					})
					return ;
				}
				
				if (this.address_code.slice(2, 4) !== '00') {
					this.setIndexList(this.areaOptions);
					this.setCurrentAddressItemIndex('area');
					
					
					return ;
				}
				
				if (this.address_code.slice(0, 2) !== '00') {
					this.setIndexList(this.cityOptions);
					this.setCurrentAddressItemIndex('city');
					return ;
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	$color-red: #FF0000;
	$spacing-col-xl: 40rpx;
	$spacing-row-xl: 50rpx;
	
	.border-bottom {
		border-bottom-width: 0.5px;
		border-bottom-color: #EEEEEE;
		border-bottom-style: solid;
	}
	
	.picker-region {
		/* #ifdef MP-WEIXIN */
		height: 100%;
		/* #endif */
		
		overflow: hidden;
		background-color: $uni-bg-color;
		
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		
		// @include border(2px solid red)
	}
	
	.title-line {
		width: 80rpx;
		height: 8rpx;
		background-image: linear-gradient(to right, rgba($color-red, 1),rgba($color-red, 0.4));
	}
	.header {
		margin: $uni-spacing-row-lg 0;
		
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.header-text {
		font-size: $uni-font-size-lg*1.2;
		font-weight: bold;
	}
	.country-option-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
	.country-option {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		
		height: 60rpx;
		margin-right: $uni-spacing-col-lg;
	}
	.country-option-text {
		font-size: $uni-font-size-lg;
	}
	
	.current-address-section {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
	.current-address-item {
		padding: $uni-spacing-col-base $uni-spacing-col-lg;
	}
	.current-address-item-text {
		font-size: $uni-font-size-lg;
	}
	.current-address-item-text-selected {
		color: $color-red;
	}
	
	
	.address-section {
		height: 0;
		flex: 1;
		// @include border(2px solid blue)
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
	.address-list-wrap {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		// margin-left: $uni-spacing-col-lg*2;
	}
	.hot-city-list {
		margin: 0 $spacing-col-xl;
	}
	.hot-city-title {}
	.hot-city-title-text {
		font-size: $uni-font-size-lg;
	}
	.hot-city-content {
		// @include border(2px solid red)
		
	}
	.hot-city-item {
		// @include border(2px solid)
		height: 70rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.hot-city-item-text {
		font-size: $uni-font-size-lg;
	}
	.address-list {
		flex: 1;
		// @include border(2px solid green)
	}
	.address-group {
		
	}
	.address-group-name {
		position: sticky;
		top: 0;
		left: 0;
		right: 0;
		padding: $uni-spacing-row-base 0;
		// padding-bottom: $uni-spacing-row-base;
		margin: 0 $spacing-col-xl;
		
		background-color: $uni-bg-color;
		
		// @include border(2px solid red);
		
		/* #ifndef APP-NVUE */
		z-index: 1;
		/* #endif */
	}
	.address-group-name-text {
		font-size: $uni-font-size-base;
		font-weight: bold;
	}
	.address-group-content {
		margin: 0 $spacing-col-xl;
	}
	.address-group-item {
		padding: $uni-spacing-row-base 0;
	}
	.address-group-item-text {
		font-size: $uni-font-size-base;
	}
	
	.address-index-wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
		margin-right: $uni-spacing-col-lg;
	}
	.address-index {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		
		padding: $uni-spacing-row-base 0;
		
		border-radius: 10000px;
		background-color: $uni-bg-color-grey;
	}
	.address-index-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 $uni-spacing-col-base;
	}
	.address-index-item-text {
		font-size: $uni-font-size-sm;
	}
	.address-index-item-text-selected {
		color: $color-red;
	}
</style>