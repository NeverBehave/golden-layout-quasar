import { Watch, Component, Prop, Emit, Model } from 'vue-property-decorator'
import { glRow } from './gl-groups'
import Vue from 'vue'
import * as $ from 'jquery'
import { goldenChild } from './roles'

@Component
export default class glDstack extends glRow {
	//TODO: `closable` should be forced true for the row, and forwarded to the created stack
	@Prop({default: false}) closable: boolean
	
	@Model('tab-change') activeTab: string
	// eslint-disable-next-line no-unused-vars
	@Emit() tabChange(tabId: string) { }
	@Watch('activeTab', {immediate: true}) progTabChange(tabId: any) {
		if('undefined'!== typeof tabId && null!== tabId) {
			for(let child of <goldenChild[]>this.$children)
				if(child.givenTabId === tabId) {
					child.focus();
					break;
				}
		}
	}

	get glChildrenTarget() { return this.stack; }
	content: any[]
	getChildConfig(): any {
		var config = (<any>glRow).extendOptions.methods.getChildConfig.apply(this);  //super is a @Component
		this.content = config.content.filter((x: any) => !x.isClosable && !x.reorderEnabled);
		config.content = [{
			type: 'stack',
			content: config.content.slice(0)
		}];
		return config;
	}
	initialState() {
		this.initStack(this.stack);
	}
	get activeContentItemChanged() {
		return (()=> {
			var vueObject = this.stack.getActiveContentItem().vueObject;
			if(vueObject)
				this.tabChange(vueObject.givenTabId);
		}).bind(this);
	}
	initStack(stack: any) {
		stack.on('activeContentItemChanged', this.activeContentItemChanged);
		stack.on('beforePopOut', (stack: any)=> {
			stack.contentItems
				.filter((x: any)=> !x.config.isClosable && !x.config.reorderEnabled)
				.forEach((comp: any, index: number)=> {
					stack.removeChild(comp);
					if(index < stack.config.activeItemIndex)
						--stack.config.activeItemIndex;
				});
		});
		stack.on('poppedOut', (bw: any)=> bw.on('beforePopIn', ()=> {
			// TODO: store the d-stack nodePath in the window config to pop-in in the right d-stack even after page reload
			var bwGl = bw.getGlInstance(),
				childConfig = $.extend(true, {}, bwGl.toConfig()).content[0],
				stack = this.stack;
			for(let item of childConfig.content)
				stack.addChild(item);
			bwGl.root.contentItems = [];
		}));
		stack.on('itemCreated', (event: any)=> {
			this.addAnchor(event.origin);
		});
	}
	addAnchor(item: any) {
		if(item.parent === this.stack && !item.config.isClosable && !item.config.reorderEnabled)
			setTimeout(()=> {
				var tab = item.tab;
				if(tab) tab.element.append('<b class="dstack_anchor" />');
			});
	}
	cachedStack: any = null
	get stack() {
		var ci = this.glObject , rv: any;
		if(!ci) return null;
		if(this.cachedStack && this.cachedStack.vueObject.glObject)
			return this.cachedStack;
		rv = ci.contentItems.find((x: any) => x.isStack);
		if(!rv) {
			ci.addChild({
				type: 'stack',
				content: this.content.slice(0)
			}, 0);
			rv = ci.contentItems[0];
			for(let item of rv.contentItems)
				this.addAnchor(item);
			this.initStack(rv);
			this.activeContentItemChanged();
		}
		rv.on('destroyed', ()=> Vue.nextTick(()=> {
			this.cachedStack = null;
			this.stack;
		}));
		return this.cachedStack = rv;
	}
	
	@Watch('stack.vueObject.glObject')
	observe(obj: any) {
		//stacks created by the users are created without an activeItemIndex
		//set `activeItemIndex` observed
		if(obj) {
			var config = obj.config, aii = config.activeItemIndex;
			delete config.activeItemIndex;
			this.$set(config, 'activeItemIndex', aii);
		}
	}
	async created() {
		await this.layout.glo;
		this.stack;
	}
}
