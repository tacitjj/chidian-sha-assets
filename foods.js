/** 浏览器内置菜库；价格为常见单人份参考区间，非商户报价。 */
export const FOODS = [
  ['麻辣烫',18,28,'soup',2,'heavy,junk','想吃的都往碗里放，快乐自己配。'],
  ['云南小锅米线',16,24,'noodle',1,'soul','一口热汤，把纠结都熨平。'],
  ['螺蛳粉',15,25,'noodle',2,'heavy,junk','酸笋一出场，今天的主角就定了。'],
  ['芝士火鸡面',12,20,'noodle',3,'heavy,junk','奶香加暴击辣，记得备一杯水。'],
  ['长沙臭豆腐',10,15,'snack',1,'heavy,junk','闻着有个性，吃着很上头。'],
  ['榴莲千层',25,40,'cake',0,'sweet,heavy','今天的快乐，一层叠一层。'],
  ['凉拌折耳根',8,15,'leaf',1,'heavy,light','爱的人会懂，这口脆爽很特别。'],
  ['麻辣香锅',25,40,'soup',2,'heavy,junk','荤素组个队，香到米饭自动消失。'],
  ['酸辣粉',10,18,'noodle',2,'heavy,junk','酸得精神，辣得开心。'],
  ['重庆小面',12,18,'noodle',2,'heavy,soul','小小一碗，麻辣能量拉满。'],
  ['过桥米线',20,30,'noodle',0,'soul','热汤、鲜肉和米线，好好吃一餐。'],
  ['番茄肥牛米线',20,28,'noodle',0,'soul','酸甜番茄汤，裹住每一根米线。'],
  ['南昌拌粉',10,16,'noodle',1,'heavy,soul','拌开就是香，便宜也能吃尽兴。'],
  ['桂林米粉',12,18,'noodle',1,'soul','卤水一拌，嗦粉的灵魂就有了。'],
  ['牛肉拉面',16,25,'noodle',0,'soul','汤清面劲道，踏实的一餐。'],
  ['炸酱面',15,22,'noodle',0,'soul','浓浓酱香，拌一拌就很满足。'],
  ['油泼面',14,22,'noodle',2,'heavy,soul','热油一响，香气直接到位。'],
  ['武汉热干面',8,14,'noodle',0,'soul','芝麻酱拌得开，今天就想得开。'],
  ['韩式炸鸡',22,38,'chicken',1,'junk','咔嚓一下，把烦恼咬碎。'],
  ['汉堡薯条',20,35,'burger',0,'junk','碳水和酥脆，快乐的经典组合。'],
  ['双层芝士汉堡',22,35,'burger',0,'junk','两层满足，芝士加倍。'],
  ['鸡肉卷',12,20,'wrap',0,'junk,soul','一卷到位，适合不想想太多的你。'],
  ['披萨',28,45,'pizza',0,'junk','拉个丝，给今天一点仪式感。'],
  ['烤冷面',10,16,'snack',1,'junk','酸甜酱一刷，街头快乐到手。'],
  ['手抓饼',8,13,'wrap',0,'junk','外酥里软，再加个蛋就很香。'],
  ['狼牙土豆',8,15,'snack',1,'heavy,junk','一口一个，香辣很难停下来。'],
  ['铁板鱿鱼',12,22,'snack',1,'heavy,junk','铁板滋滋响，夜市的灵魂上线。'],
  ['炸串',15,25,'chicken',1,'junk','把想吃的串起来，今天就放纵一下。'],
  ['烧烤',30,50,'chicken',1,'heavy,junk','烟火气上桌，日子就有滋味。'],
  ['关东煮',12,22,'soup',0,'soul,light','热热的一杯，暖到刚刚好。'],
  ['黄焖鸡米饭',18,25,'rice',1,'soul','浓汁拌饭，稳稳的幸福感。'],
  ['红烧肉盖饭',20,30,'rice',0,'soul','肥瘦刚好，配饭一流。'],
  ['番茄炒蛋盖饭',12,18,'rice',0,'soul,light','吃一口，是熟悉的家常味道。'],
  ['鱼香肉丝盖饭',16,24,'rice',1,'soul','酸甜带点辣，每一口都很下饭。'],
  ['宫保鸡丁盖饭',16,24,'rice',1,'soul','鸡丁和花生，搭档从不失手。'],
  ['咖喱鸡饭',20,30,'rice',0,'soul','浓郁咖喱，治好今天的没胃口。'],
  ['照烧鸡腿饭',20,30,'rice',0,'soul','亮晶晶的照烧汁，甜咸刚刚好。'],
  ['卤肉饭',18,28,'rice',0,'soul','一勺卤肉，给米饭加满快乐。'],
  ['蛋炒饭',10,16,'rice',0,'soul','粒粒分明，简单也可以很好吃。'],
  ['扬州炒饭',15,22,'rice',0,'soul','配料多一点，满足多一点。'],
  ['煲仔饭',22,35,'rice',0,'soul','锅巴咔嚓，酱汁香到最后一粒。'],
  ['东北水饺',16,26,'dumpling',0,'soul','蘸一碟醋，吃得踏踏实实。'],
  ['生煎包',12,20,'dumpling',0,'soul','底脆汁鲜，小心第一口烫。'],
  ['小笼包',15,25,'dumpling',0,'soul','先喝一口汤，再接住满口鲜。'],
  ['馄饨',12,20,'dumpling',0,'soul,light','皮薄馅鲜，热汤温柔收场。'],
  ['寿司',22,38,'rice',0,'light,soul','一口一个，清爽又省心。'],
  ['鸡胸肉沙拉',22,35,'leaf',0,'light','蔬菜脆脆的，吃完轻轻松松。'],
  ['荞麦冷面',18,28,'noodle',0,'light','清清爽爽，给胃口放个小假。'],
  ['清汤牛肉粉',18,28,'noodle',0,'light,soul','鲜汤加牛肉，清淡也有好滋味。'],
  ['蔬菜豆腐汤饭',15,23,'soup',0,'light','热汤和蔬菜，温柔但不寡淡。'],
  ['虾仁蒸蛋套餐',22,32,'rice',0,'light','滑嫩鲜甜，好好照顾一下自己。'],
  ['海南鸡饭',25,38,'rice',0,'light,soul','鸡肉鲜嫩，米饭自带香气。'],
  ['潮汕砂锅粥',22,35,'soup',0,'light,soul','慢慢煮的鲜，慢慢吃的舒服。'],
  ['皮蛋瘦肉粥',10,18,'soup',0,'light,soul','胃想休息时，它很懂你。'],
  ['猪脚饭',20,30,'rice',0,'soul','卤香浓郁，补满干饭能量。'],
  ['酸菜鱼套餐',25,40,'soup',1,'heavy,soul','酸菜开胃，鱼肉鲜嫩。'],
  ['冒菜',18,30,'soup',2,'heavy','一人份的小火锅，热辣不用等人。'],
  ['串串香',25,40,'soup',2,'heavy,junk','一签一签，把快乐攒起来。'],
  ['钵钵鸡',20,35,'chicken',2,'heavy','红油与藤椒，香得很有记忆点。'],
  ['新疆炒米粉',18,28,'noodle',3,'heavy','酱香浓、辣得爽，嗦一口就精神。'],
  ['凉皮肉夹馍',16,25,'wrap',1,'soul','一口凉皮一口馍，经典搭配不纠结。'],
  ['酸汤肥牛饭',25,35,'rice',1,'heavy,soul','金汤酸香，配饭十分认真。'],
  ['韩式拌饭',20,30,'rice',1,'soul','蔬菜鸡蛋拌一拌，颜色也很好吃。'],
  ['部队锅',30,45,'soup',2,'heavy,junk','泡面芝士年糕，快乐一锅装。'],
  ['冬阴功粉',25,38,'noodle',1,'heavy','酸辣鲜香，胃口原地起飞。'],
  ['泰式打抛饭',25,35,'rice',1,'heavy,soul','罗勒香气加肉末，一勺就入魂。'],
  ['烤肉拌饭',18,28,'rice',1,'junk,soul','烤肉和米饭，总是合得来。'],
  ['芒果糯米饭',20,32,'cake',0,'sweet','芒果甜甜，椰香软糯。'],
  ['舒芙蕾',22,35,'cake',0,'sweet','轻轻晃一下，快乐软乎乎。'],
  ['杨枝甘露',15,25,'cake',0,'sweet','芒果和柚子，把清甜装满一杯。'],
  ['红豆双皮奶',12,22,'cake',0,'sweet','奶香浓浓的，今天对自己甜一点。'],
  ['巧克力华夫饼',18,28,'cake',0,'sweet,junk','外脆内软，巧克力负责加分。'],
  ['冰淇淋',8,18,'cake',0,'sweet,junk','把今天的燥热，交给这一口。'],
  ['糖油粑粑',8,15,'cake',0,'sweet,junk','糯叽叽的小快乐，趁热接住。'],
  ['冰粉',8,15,'cake',0,'sweet,light','滑滑凉凉，一口轻盈的甜。'],
  ['榴莲披萨',32,48,'pizza',0,'sweet,heavy,junk','榴莲遇上芝士，浓香双倍出击。'],
  ['煎饼果子',8,15,'wrap',0,'soul','薄脆加鸡蛋，简单但很完整。'],
  ['豆浆油条',6,12,'wrap',0,'soul','热豆浆和酥油条，经典不会过时。'],
  ['饭团',8,16,'rice',0,'soul','一手握住，扎实的满足感。'],
  ['茶叶蛋小米粥',6,12,'soup',0,'light','温和的一餐，也很有力量。'],
  ['鸡蛋三明治',12,20,'wrap',0,'light,soul','鸡蛋蔬菜夹好，清爽直接出发。'],
  ['牛肉粉丝汤',16,25,'noodle',0,'soul','鲜香热乎，随时都能吃得满足。'],
  ['盐酥鸡',15,25,'chicken',1,'junk','酥酥香香，撒上椒盐刚刚好。'],
  ['章鱼小丸子',12,20,'snack',0,'junk','一口一个，酱汁和木鱼花绝配。'],
].map(([name,min,max,icon,spicy,tags,note],index)=>({
  id:`food-${index+1}`,name,min,max,icon,spicy,tags:tags.split(','),note,
  meals: ['豆浆油条','茶叶蛋小米粥'].includes(name) ? ['breakfast','snack'] :
    ['煎饼果子','手抓饼','小笼包','馄饨','生煎包','鸡蛋三明治','饭团','皮蛋瘦肉粥','武汉热干面','牛肉粉丝汤'].includes(name) ? ['breakfast','lunch','dinner','snack'] :
    ['sweet','junk'].some(t=>tags.split(',').includes(t)) ? ['lunch','dinner','snack'] : ['lunch','dinner'],
}));

/** 按餐次、人均最高参考价、偏好与排除列表生成唯一候选集合。 */
export function filterFoods(foods,settings,{excluded=[],eaten=[]}={}) {
  return foods.filter(food=>food.meals.includes(settings.meal)
    && (!settings.budget || food.max<=settings.budget)
    && (settings.vibe==='all'||food.tags.includes(settings.vibe))
    && (!settings.noSpicy||food.spicy===0)
    && !excluded.includes(food.id)
    && (!settings.noRepeat||!eaten.includes(food.id)));
}

/** 使用浏览器随机源生成等概率下标，拒绝尾部余数避免取模偏差。 */
export function randomIndex(length) {
  if(!Number.isInteger(length)||length<1) throw new RangeError('没有可抽取的候选');
  const ceiling=Math.floor(0x100000000/length)*length;
  const values=new Uint32Array(1);
  do { crypto.getRandomValues(values); } while(values[0]>=ceiling);
  return values[0]%length;
}

/** Fisher–Yates 洗牌，供转盘取本轮展示候选；不会修改原始菜库。 */
export function sampleFoods(foods,count=12) {
  const result=[...foods];
  for(let i=result.length-1;i>0;i--){ const j=randomIndex(i+1); [result[i],result[j]]=[result[j],result[i]]; }
  return result.slice(0,count);
}

/** 指针固定在十二点方向，将目标扇区中点旋转至指针下。 */
export function targetRotation(current,index,count,turns=6) {
  const normalized=((current%360)+360)%360;
  const desired=(360-(index+.5)*360/count)%360;
  return current+turns*360+((desired-normalized+360)%360);
}
