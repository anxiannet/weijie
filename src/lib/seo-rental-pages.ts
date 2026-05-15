import type {Metadata} from 'next';

export type FAQItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  title: string;
  href: string;
  description: string;
};

export type ComparisonTableData = {
  caption: string;
  headers: string[];
  rows: string[][];
};

export type SeoSection = {
  title: string;
  intro: string;
  items?: {
    title: string;
    body: string;
  }[];
};

export type RentalSeoPage = {
  slug: string;
  h1: string;
  subtitle: string;
  seoTitle: string;
  description: string;
  keywords: string[];
  imageAlt: string;
  updatedAt: string;
  readingTime: string;
  lead: string[];
  sections: SeoSection[];
  table: ComparisonTableData;
  faqs: FAQItem[];
  relatedSlugs: string[];
};

export const SITE_URL = 'https://weijie.sg';

const commonRelatedFallback = [
  'student-rental-guide-singapore',
  'singapore-rental-scams-guide',
  'best-areas-for-students-singapore',
  'hdb-vs-condo-singapore',
  'common-room-vs-master-room-singapore',
  'singapore-rental-contract-guide',
];

export const rentalSeoPages: Record<string, RentalSeoPage> = {
  'student-rental-guide-singapore': {
    slug: 'student-rental-guide-singapore',
    h1: '新加坡留学生租房指南（2026最新版）',
    subtitle: '从房型、房间、预算、通勤到签约风险，帮助第一次来新加坡的学生先建立清晰判断框架。',
    seoTitle: '新加坡留学生租房指南 2026｜房型、价格、区域与避坑｜Weijie.sg',
    description: '2026 新加坡留学生租房完整指南：了解 HDB、Condo、Common Room、Master Room、学生公寓、Co-living、租房价格、通勤区域和避坑建议。',
    keywords: ['新加坡留学生租房', '新加坡租房指南', '新加坡学生租房', 'Singapore student rental', '新加坡 common room', '新加坡 master room'],
    imageAlt: '新加坡留学生租房指南信息图',
    updatedAt: '2026-05-14',
    readingTime: '约 12 分钟阅读',
    lead: [
      '新加坡留学生租房最容易卡住的地方，不是房源太少，而是信息太分散：房型名称、区域通勤、押金规则、中介费、合租习惯和合同条款常常混在一起。先看懂这些基础概念，再去比较具体房源，会比只盯着价格更稳。',
      '这篇指南适合准备来新加坡读本科、硕士、语言课程或私立院校的学生。内容不承诺“保证找到房”，而是把常见选择拆开，让你知道每一种选择的成本、便利度和可能牺牲的部分。',
      '2026 年看房时，建议同时关注月租、通勤、室友、合同、网络、水电和空调清洗。房租只是第一层成本，真正影响居住体验的是每天能否稳定上课、休息和处理生活事务。',
    ],
    sections: [
      {
        title: '新加坡留学生为什么要先看懂房型',
        intro: '新加坡租房广告里常出现 HDB、Condo、Common Room、Master Room、Studio、Co-living 等词。它们不是简单的高低档区别，而是对应不同建筑类型、隐私程度、公共设施和合租规则。先看懂房型，可以避免把不适合自己的房源加入候选清单，也能更准确地判断价格是否合理。',
      },
      {
        title: '新加坡常见出租房屋类型',
        intro: '房屋类型决定了你会住在什么样的小区、能否使用泳池健身房、邻里环境如何，以及日常采购和交通是否方便。留学生通常会在 HDB、Condo、学生宿舍和 Co-living 之间比较。',
        items: [
          {title: 'HDB 组屋', body: 'HDB 是新加坡最常见的公共住宅，生活便利度通常不错，楼下可能有食阁、超市、诊所和巴士站。对预算敏感、希望快速融入本地生活的学生，HDB 合租是很常见的选择。需要注意的是，部分房东会对做饭、访客和空调使用有明确规则。'},
          {title: 'Condo 私人公寓', body: 'Condo 通常带有门禁、泳池、健身房和公共设施，居住环境更统一，隐私和管理体验相对更好。价格一般高于 HDB，适合预算较高、重视设施和小区管理的学生。看房时要确认设施是否可用、访客是否需要登记，以及租金是否包含管理相关费用。'},
          {title: 'Student Hostel 学生宿舍', body: '学生宿舍通常靠近学校或有明确学生群体，适合刚落地、希望减少适应成本的新生。优点是管理清楚、社交便利，缺点是空间和隐私有限，入住规则也可能更严格。申请前要确认是否能续住、是否允许假期留宿。'},
          {title: 'Co-living 共享公寓', body: 'Co-living 通常提供家具、网络、公共清洁和较灵活的入住流程，适合短期过渡或不想处理太多杂项的学生。价格可能包含服务溢价，合同条款也更平台化。签约前要看清退订、押金、公共空间使用和清洁责任。'},
          {title: 'Landed House 排屋/别墅', body: 'Landed House 空间大，但位置、交通和室友结构差异很大。部分房源适合多人合租，部分可能距离地铁较远。留学生选择这类房源时，尤其要确认通勤路线、夜间回家方式和房间是否合法分租。'},
        ],
      },
      {
        title: '新加坡常见房间类型',
        intro: '房间类型直接影响价格、隐私和日常舒适度。看房时不要只看照片，要确认房间是否有窗、是否能放书桌、是否带独立卫生间，以及是否需要和几个人共用浴室。',
        items: [
          {title: 'Common Room', body: 'Common Room 是普通房，通常不带独立卫生间，需要和其他室友共用浴室。它是留学生最常见的预算型选择，适合单人居住，也适合对隐私要求适中、愿意共享公共空间的学生。'},
          {title: 'Master Room', body: 'Master Room 是主人房，通常带独立卫生间，空间更大，价格也更高。适合预算较充足、重视隐私，或两位朋友、情侣共同承担租金的情况。'},
          {title: 'Utility Room', body: 'Utility Room 通常面积较小，可能没有完整窗户或储物空间有限。价格低不一定代表划算，重点要确认通风、采光、消防安全和是否适合长期居住。'},
          {title: 'Partition Room', body: 'Partition Room 是隔间房，风险取决于隔断方式、通风、消防和人数限制。遇到明显低价、无窗、多人共用拥挤空间的广告，要谨慎核验。'},
          {title: 'Studio', body: 'Studio 是独立开间，通常包含睡眠区、简单厨房或独立卫浴。隐私最好，价格也更高，适合预算明确且希望减少室友变量的学生。'},
        ],
      },
      {
        title: '2026 新加坡留学生租房价格参考',
        intro: '价格会随地段、屋龄、家具、是否包水电网、是否靠近地铁和开学季波动。一般来说，HDB Common Room 更适合预算入门，Condo Common Room 和 Master Room 对舒适度更友好，Studio 与学生公寓则适合预算更高或需要独立空间的学生。比较价格时，要把水电网、空调清洗、押金、中介费和搬家成本一起算入预算。',
      },
      {
        title: '留学生怎么根据预算选房',
        intro: '预算低时，优先锁定安全、通勤和基本休息条件，不要为了节省一点租金接受无窗、过度拥挤或合同不清楚的房间。预算中等时，可以在 HDB 好地段和 Condo 普通房之间比较。预算较高时，再考虑 Master Room、Studio 或管理更完整的学生公寓。',
      },
      {
        title: '第一次来新加坡推荐怎么住',
        intro: '第一次来新加坡可以先选择规则清楚、通勤稳定、生活配套成熟的区域。NUS 学生常看 Clementi、Dover、Buona Vista、Queenstown；NTU 学生常看 Pioneer、Boon Lay、Jurong West；SMU 学生可以看 Bugis、Dhoby Ghaut、Novena、Toa Payoh、Queenstown 等。刚落地时，过度追求“最便宜”往往会增加后续换房成本。',
      },
      {
        title: '租房避坑重点',
        intro: '不要在没有看房、没有合同、没有收据的情况下支付大额订金。不要只相信截图和口头承诺，尽量视频看房或实地看房，保存聊天记录、付款凭证和房屋状态照片。签约前要看清押金退还、维修责任、空调清洗、访客、做饭、提前退租和转租条款。',
      },
      {
        title: '推荐继续阅读',
        intro: '如果你已经知道大概预算，下一步可以按学校、区域和房型继续拆解。区域决定通勤，房型决定体验，合同决定风险边界。把这些内容串起来看，会比单独刷房源更有效。',
      },
    ],
    table: {
      caption: '2026 新加坡留学生常见租房选择对比',
      headers: ['类型', '适合人群', '优势', '需要注意'],
      rows: [
        ['HDB Common Room', '预算敏感、重视生活便利', '价格相对友好，社区配套成熟', '卫生间共用，规则因房东而异'],
        ['Condo Common Room', '希望设施和管理更完整', '小区环境稳定，设施较多', '租金和押金通常更高'],
        ['Master Room', '重视隐私或两人合住', '独立卫生间，空间更好', '价格明显高于普通房'],
        ['Student Hostel', '新生、短期过渡', '管理清楚，学生群体集中', '空间有限，规则较多'],
        ['Studio', '预算较高、希望独立居住', '隐私好，室友变量少', '成本高，供应有限'],
      ],
    },
    faqs: [
      {question: '新加坡留学生租房一般提前多久开始看？', answer: '建议入学前 6 到 8 周开始了解区域和预算，入境前 2 到 4 周集中看具体房源。开学季、换租季和热门学校周边会更紧张。'},
      {question: 'Common Room 和 Master Room 怎么选？', answer: 'Common Room 预算更友好，但通常需要共用卫生间；Master Room 通常带独立卫生间，隐私更好，价格也更高。单人预算有限可先看 Common Room，两人合住可比较 Master Room。'},
      {question: '新加坡租房押金通常是多少？', answer: '常见做法是按租期和房东要求收取一个月或两个月押金。具体金额和退还条件必须写进合同，并保留付款凭证。'},
      {question: '刚到新加坡适合先短租吗？', answer: '如果还没确定学校课表、通勤路线或长期预算，可以先选择规则清楚的短租或学生公寓过渡。但要确认短租是否合法、是否有清楚的入住和退款规则。'},
      {question: '租房广告里的“包水电网”可靠吗？', answer: '需要问清是否有用量上限、空调是否另算、网络是否稳定、超额费用怎么算。最好把这些内容写进合同或至少保留文字记录。'},
      {question: '可以只看照片就订房吗？', answer: '不建议。至少要视频看房，确认房间、卫生间、窗户、公共区域、门禁和周边交通。支付订金前应确认对方身份、合同和收据。'},
    ],
    relatedSlugs: ['singapore-rental-scams-guide', 'best-areas-for-students-singapore', 'hdb-vs-condo-singapore', 'common-room-vs-master-room-singapore', 'singapore-rental-contract-guide', 'singapore-student-living-cost-guide'],
  },
  'singapore-rental-scams-guide': {
    slug: 'singapore-rental-scams-guide',
    h1: '新加坡租房避坑指南：留学生租房前一定要知道的事',
    subtitle: '识别假房源、低价陷阱、押金风险、合同细节和看房检查点，减少第一次租房的信息差。',
    seoTitle: '新加坡租房避坑指南｜留学生租房防骗、合同、押金注意事项｜Weijie.sg',
    description: '新加坡留学生租房前必看：如何识别假房源、违规隔间、押金风险、中介费问题、合同陷阱和看房注意事项。',
    keywords: ['新加坡租房避坑', '新加坡租房防骗', '新加坡租房押金', '新加坡租房合同', '新加坡留学生租房注意事项'],
    imageAlt: '新加坡租房避坑检查清单',
    updatedAt: '2026-05-14',
    readingTime: '约 9 分钟阅读',
    lead: [
      '新加坡租房整体规则相对清晰，但留学生第一次远程找房时，仍然容易遇到假房源、订金催付、违规隔间、合同含糊和押金扣除争议。',
      '避坑的核心不是完全不相信任何人，而是把每一步都留痕：看房、核验身份、确认条款、付款凭证、入住照片。只要关键证据清楚，大多数风险都能提前降低。',
    ],
    sections: [
      {title: '为什么留学生更容易踩租房坑', intro: '留学生通常在入境前就要找房，对新加坡地名、交通、租房词汇和本地规则不熟，容易被“靠近学校”“马上没了”“先付订金锁房”等话术推动。家长也常在国内协助付款，沟通链条越长，越需要把合同和凭证整理清楚。'},
      {title: '假房源常见特征', intro: '假房源往往使用过度精修或重复出现的照片，价格明显低于同区域同类型房间，发布者回避视频看房和身份核验，并持续催促转账。遇到只愿意文字沟通、不愿展示房屋细节、不提供合同草稿的情况，应暂停付款。'},
      {title: '低价房源为什么要小心', intro: '低价不一定是骗局，但一定要问清原因。可能是房间小、位置远、不能做饭、无窗、入住人数多、租期限制严格，或水电网另算。真实低价房源通常也能解释清楚条件，而不是只强调“今天必须定”。'},
      {title: '违规隔间和无窗房风险', intro: '隔间房、储物间改房和无窗房可能带来通风、消防、隐私和合规风险。看房时要确认房间是否有自然采光、空调或通风、门锁是否安全、公共区域是否拥挤，以及同一单位实际住了多少人。'},
      {title: '押金怎么付才安全', intro: '押金应在合同、房东或授权方身份、房屋地址和租期确认后再支付。转账备注要写清用途，保存收据和聊天记录。不要把大额押金转给身份不明的个人账户，也不要接受只有口头承诺的“预留房”。'},
      {title: '中介费什么时候需要付', intro: '中介费取决于你是否委托租客中介、租金金额、租期和具体服务关系。看到 No Agent Fee 时，要确认是否只是对租客免中介费，还是由房东承担。不要重复支付给房东中介和租客中介。'},
      {title: '合同里必须看清楚的条款', intro: '重点看租期、押金退还、水电网、空调清洗、维修责任、访客规则、做饭规则、提前退租、转租限制和 Inventory List。任何“入住后再说”的费用，都可能变成后续争议。'},
      {title: '看房 checklist', intro: '看房时检查门锁、窗户、空调、床垫、书桌、衣柜、洗衣机、热水器、网络、厨房、卫生间和公共区域。拍下现有损坏，问清谁负责维修，记录最近 MRT 或巴士站的实际步行时间。'},
      {title: '签约前 checklist', intro: '签约前确认房东或中介身份、合同地址、入住日期、租金和押金金额、付款账户、退租条件、钥匙交接、家具清单和房屋状态照片。所有付款都应有凭证。'},
    ],
    table: {
      caption: '新加坡留学生租房高风险信号',
      headers: ['信号', '可能风险', '建议动作'],
      rows: [
        ['价格显著低于周边', '假房源或隐藏限制', '对比同区房源并要求解释条件'],
        ['拒绝视频看房', '房源不存在或照片不真实', '暂停付款，要求实时看房'],
        ['只催订金不发合同', '付款后难追溯', '先看合同和收据模板'],
        ['无窗或隔间过多', '通风、消防和居住体验风险', '核验实际空间和入住人数'],
        ['押金退还条件模糊', '退租时容易争议', '写入合同并拍照留档'],
      ],
    },
    faqs: [
      {question: '没有到新加坡，可以远程订房吗？', answer: '可以远程比较和视频看房，但不建议在身份、合同和房屋细节不清楚时支付大额订金。最好让可信同学实地代看，或选择规则透明的平台化房源。'},
      {question: '押金付给中介还是房东？', answer: '要看合同和授权关系。付款前应确认收款方身份、授权文件和收据，并在转账备注写明房屋地址、租期和押金用途。'},
      {question: '低价房一定有问题吗？', answer: '不一定，但必须问清价格低的原因，例如位置远、房间小、不能做饭、租期短、无窗或费用另算。解释不清楚时要谨慎。'},
      {question: '看房时最容易忽略什么？', answer: '很多学生只看卧室，忽略卫生间共用人数、厨房规则、洗衣机、网络稳定、空调维护和夜间回家路线。'},
      {question: '合同可以只看中文翻译吗？', answer: '不建议只看翻译。正式签署文本通常以英文为准，遇到不理解的条款应逐条确认含义，再决定是否签。'},
    ],
    relatedSlugs: ['student-rental-guide-singapore', 'singapore-rental-contract-guide', 'singapore-agent-fee-rental-guide', 'common-room-vs-master-room-singapore', 'hdb-vs-condo-singapore', 'best-areas-for-students-singapore'],
  },
  'best-areas-for-students-singapore': {
    slug: 'best-areas-for-students-singapore',
    h1: '新加坡留学生住哪里比较好？热门租房区域指南',
    subtitle: '按学校、通勤、租金和生活便利度比较 Queenstown、Clementi、Buona Vista、Novena、Jurong East、Tampines 等区域。',
    seoTitle: '新加坡留学生租房区域推荐｜NUS、NTU、SMU 附近住哪里｜Weijie.sg',
    description: '新加坡留学生租房区域指南：分析 Queenstown、Clementi、Buona Vista、Novena、Jurong East、Tampines 等区域的通勤、租金和生活便利度。',
    keywords: ['新加坡留学生住哪里', '新加坡租房区域推荐', 'NUS 附近租房', 'NTU 附近租房', 'SMU 附近租房'],
    imageAlt: '新加坡留学生热门租房区域示意图',
    updatedAt: '2026-05-14',
    readingTime: '约 10 分钟阅读',
    lead: [
      '新加坡留学生选区域，不只是看离学校近不近。更现实的问题是：每天通勤是否稳定、晚课后是否方便回家、附近是否能吃饭采购、房租是否和预算匹配。',
      '同一个学校也可能有多个适合区域。NUS 学生可以沿西部和绿线比较，NTU 学生更重视西部通勤，SMU 学生则可以用市中心地铁网络扩大选择范围。',
    ],
    sections: [
      {title: '留学生选区域要看什么', intro: '优先看通勤时间、换乘次数、末班车、步行距离、附近餐饮超市、治安感受和房源类型。一个区域如果每天能节省 20 分钟通勤，长期下来会明显影响学习和休息。'},
      {title: '按学校选择区域', intro: 'NUS 可重点看 Clementi、Dover、Buona Vista、Queenstown、West Coast；NTU 可重点看 Pioneer、Boon Lay、Jurong West、Jurong East、Lakeside；SMU 可看 Dhoby Ghaut、Bugis、City Hall、Novena、Toa Payoh、Queenstown。'},
      {title: 'Queenstown', intro: 'Queenstown 在东西线沿线，去 NUS、SMU 和市中心都相对灵活。生活配套成熟，HDB 和 Condo 选择都有，适合希望兼顾通勤和生活便利的学生。价格通常不算最低，但稳定性较好。'},
      {title: 'Clementi', intro: 'Clementi 是 NUS 学生常看的区域，地铁、巴士、食阁、超市和商场都比较集中。优点是学生氛围强、去校园方便；需要注意开学季竞争和部分房源价格上浮。'},
      {title: 'Buona Vista', intro: 'Buona Vista 交通连接好，靠近 NUS、one-north 和 Holland Village 一带。适合重视通勤和周边生活质感的学生，Condo 与 HDB 选择都有，整体预算会比更远区域高一些。'},
      {title: 'Novena', intro: 'Novena 靠近市中心和医疗生活圈，去 SMU、Kaplan、PSB 等较方便，也适合想住在中心但避开核心商业区高价的学生。日常采购方便，但房租预算要提前算清。'},
      {title: 'Jurong East', intro: 'Jurong East 是西部交通和商业节点，去 NTU 需要换乘或公交，但生活配套强，商场和交通选择多。适合 NTU 学生、在西部实习或希望周末生活更便利的人。'},
      {title: 'Tampines', intro: 'Tampines 位于东部，生活配套完整，房源选择多。对在东部上课或实习的学生友好；如果学校在西部或市中心，需要认真计算通勤时间，避免每天过度奔波。'},
      {title: 'Serangoon / Bishan', intro: 'Serangoon 和 Bishan 是换乘便利、生活成熟的区域，适合需要连接多条地铁线的学生。价格通常比远郊高，但通勤弹性和生活舒适度不错。'},
      {title: '区域对比表：通勤、价格、生活便利度', intro: '区域没有绝对标准答案。建议先把学校、预算和作息写下来，再用表格排除明显不适合的选择。'},
    ],
    table: {
      caption: '新加坡留学生热门租房区域对比',
      headers: ['区域', '适合学校/人群', '通勤特点', '生活便利度'],
      rows: [
        ['Clementi', 'NUS 学生', '去 NUS 方便，西部通勤稳定', '食阁、超市、商场成熟'],
        ['Queenstown', 'NUS / SMU', '东西线连接好', '生活安静，配套完整'],
        ['Jurong East', 'NTU / 西部实习', '西部交通节点', '商场多，采购方便'],
        ['Novena', 'SMU / 市中心院校', '去市中心快', '医疗、餐饮和商场集中'],
        ['Tampines', '东部院校或实习', '东部生活圈稳定', '区域成熟，选择丰富'],
      ],
    },
    faqs: [
      {question: 'NUS 学生一定要住 Clementi 吗？', answer: '不一定。Clementi 方便但竞争较高，Dover、Buona Vista、Queenstown、West Coast 也值得比较。'},
      {question: 'NTU 学生住 Jurong East 会不会太远？', answer: '要看具体路线。Jurong East 生活便利，但去 NTU 通常还需要换乘或公交，晚课学生要特别确认回家路线。'},
      {question: 'SMU 学生适合住哪里？', answer: 'SMU 位于市中心，可看 Dhoby Ghaut、Bugis、City Hall 周边，也可用地铁扩展到 Novena、Toa Payoh、Queenstown。'},
      {question: '离学校越近越好吗？', answer: '不一定。离学校近但房间条件差、价格高或生活不便，未必比地铁直达 20 到 35 分钟的区域更适合。'},
      {question: '怎么判断通勤是否可接受？', answer: '看门到门时间，而不是只看地铁站之间时间。步行、等车、换乘和晚间班次都要算进去。'},
    ],
    relatedSlugs: ['nus-rental-guide-singapore', 'ntu-rental-guide-singapore', 'smu-rental-guide-singapore', 'singapore-student-transport-guide', 'student-rental-guide-singapore', 'hdb-vs-condo-singapore'],
  },
  'nus-rental-guide-singapore': {
    slug: 'nus-rental-guide-singapore',
    h1: 'NUS 新加坡国立大学附近租房指南',
    subtitle: '围绕 Clementi、Dover、Buona Vista、Queenstown、West Coast 和 Kent Ridge，梳理 NUS 学生常见租房选择。',
    seoTitle: 'NUS 附近租房指南｜新加坡国立大学留学生租房区域与价格｜Weijie.sg',
    description: 'NUS 留学生租房指南：了解 Clementi、Dover、Buona Vista、Queenstown、West Coast 等区域的租金、通勤和生活便利度。',
    keywords: ['NUS 附近租房', '新加坡国立大学租房', 'NUS 留学生租房', 'Clementi 租房', 'Dover 租房'],
    imageAlt: 'NUS 附近租房区域示意图',
    updatedAt: '2026-05-14',
    readingTime: '约 9 分钟阅读',
    lead: ['NUS 校区范围较大，不同学院、宿舍、实验室和上课地点会影响租房选择。看房前先确认自己常去的校区位置，再比较公交、地铁和步行路线。', 'NUS 附近房源在开学季竞争较明显，建议同时准备 2 到 3 个备选区域，避免只盯一个地铁站。'],
    sections: [
      {title: 'NUS 学生租房主要看哪些区域', intro: 'NUS 学生常看 Clementi、Dover、Buona Vista、Queenstown、West Coast 和 Kent Ridge 附近。选择时应结合学院位置、上课时间、是否晚归、是否常去市中心和预算。'},
      {title: 'Clementi', intro: 'Clementi 是 NUS 学生最常见的校外租房区域之一，生活配套集中，食阁、超市、商场和巴士路线成熟。适合希望通勤简单、生活方便的新生。热门房源价格可能较高，需要提前比较。'},
      {title: 'Dover', intro: 'Dover 靠近 NUS 和部分教育机构，环境相对安静，通勤稳定。房源选择没有 Clementi 那么密集，但对想减少通勤时间、保持学习节奏的学生比较友好。'},
      {title: 'Buona Vista', intro: 'Buona Vista 是交通连接较好的区域，去 NUS、one-north 和 Holland Village 都方便。适合预算中高、希望生活和通勤都更均衡的学生。'},
      {title: 'Queenstown', intro: 'Queenstown 稍微远一些，但东西线通勤稳定，生活配套成熟。适合希望兼顾 NUS、市中心和整体居住环境的学生。'},
      {title: 'West Coast', intro: 'West Coast 靠近 NUS 部分区域，适合能接受公交通勤、希望住得离校园近一些的学生。看房时要重点确认巴士路线和夜间回家方式。'},
      {title: 'Kent Ridge 附近选择', intro: 'Kent Ridge 周边离校园近，但房源供应相对有限，价格和房型差异明显。适合实验室、医院或学院位置非常靠近的学生重点查看。'},
      {title: 'NUS 附近租房价格参考', intro: 'Clementi 和 Buona Vista 的价格通常受学生需求影响较大，Queenstown 可能提供更均衡选择，West Coast 和 Dover 则要看具体交通。比较价格时，要同时看是否包水电网、房间面积和卫生间共用人数。'},
      {title: '不同预算推荐', intro: '预算较低可先看 HDB Common Room，并接受 25 到 40 分钟门到门通勤；预算中等可比较 HDB 好房间和 Condo Common Room；预算较高可考虑 Master Room、Studio 或管理更清楚的学生公寓。'},
    ],
    table: {
      caption: 'NUS 附近租房区域对比',
      headers: ['区域', '通勤', '预算感受', '适合人群'],
      rows: [
        ['Clementi', '去 NUS 方便', '中等到偏高', '新生、重视配套'],
        ['Dover', '通勤较短', '中等', '想安静学习'],
        ['Buona Vista', '连接灵活', '中等偏高', '重视交通和生活质感'],
        ['Queenstown', '地铁稳定', '中等', '兼顾校园和市中心'],
        ['West Coast', '多依赖公交', '差异较大', '靠近特定校区或学院'],
      ],
    },
    faqs: [
      {question: 'NUS 新生住哪里最方便？', answer: 'Clementi 和 Dover 通常比较方便，但也要看学院位置。Buona Vista、Queenstown 和 West Coast 可以作为备选。'},
      {question: 'NUS 附近租房要提前多久看？', answer: '建议开学前 6 到 8 周开始看区域，2 到 4 周内集中确认房源。热门区域需要更早准备。'},
      {question: 'West Coast 适合 NUS 学生吗？', answer: '适合部分校区和能接受公交通勤的学生。看房时要实际查门到门时间和夜间路线。'},
      {question: 'NUS 学生适合租 Condo 吗？', answer: '如果预算允许、重视设施和管理，Condo 可以考虑。预算有限时，位置好的 HDB Common Room 也很实用。'},
      {question: 'NUS 附近短租好找吗？', answer: '短租供应会随季节变化。短租前要确认租期、押金、退订和是否允许学生入住。'},
    ],
    relatedSlugs: ['student-rental-guide-singapore', 'best-areas-for-students-singapore', 'hdb-vs-condo-singapore', 'common-room-vs-master-room-singapore', 'singapore-rental-scams-guide', 'singapore-student-transport-guide'],
  },
  'ntu-rental-guide-singapore': {
    slug: 'ntu-rental-guide-singapore',
    h1: 'NTU 南洋理工大学附近租房指南',
    subtitle: '比较 Pioneer、Boon Lay、Jurong West、Jurong East 和 Lakeside，帮助 NTU 学生平衡通勤、价格与生活便利。',
    seoTitle: 'NTU 附近租房指南｜南洋理工大学留学生租房区域与价格｜Weijie.sg',
    description: 'NTU 留学生租房指南：分析 Pioneer、Boon Lay、Jurong West、Jurong East 等区域的租房价格、通勤方式和生活便利度。',
    keywords: ['NTU 附近租房', '南洋理工大学租房', 'NTU 留学生租房', 'Pioneer 租房', 'Boon Lay 租房', 'Jurong West 租房'],
    imageAlt: 'NTU 附近租房区域示意图',
    updatedAt: '2026-05-14',
    readingTime: '约 9 分钟阅读',
    lead: ['NTU 位于新加坡西部，校园面积大，校内外通勤方式对生活体验影响很明显。租房时不能只看地图直线距离，要看公交、校车、换乘和晚间路线。', '如果没有校内宿舍，校外租房建议优先比较 Pioneer、Boon Lay、Jurong West、Jurong East 和 Lakeside。'],
    sections: [
      {title: 'NTU 为什么租房区域选择很重要', intro: 'NTU 学生经常需要在校园、地铁站和住处之间切换。如果区域选得太远或换乘复杂，早课、晚课和小组作业都会变得疲惫。区域选择应该优先保证通勤稳定，再看价格和生活配套。'},
      {title: 'Pioneer', intro: 'Pioneer 靠近 NTU 通勤节点，是很多学生会优先看的区域。优势是去学校相对直接，生活配套够用。热门房源竞争较高，看房时要确认到校园具体地点的路线。'},
      {title: 'Boon Lay', intro: 'Boon Lay 生活便利度较强，靠近交通和商业配套。适合希望在西部保持稳定生活节奏的学生。去 NTU 的通勤方式较成熟，但仍需看具体住址和巴士路线。'},
      {title: 'Jurong West', intro: 'Jurong West 房源选择较多，价格层次也更丰富。部分位置去 NTU 方便，部分则需要更长公交。适合预算敏感、愿意仔细筛选路线的学生。'},
      {title: 'Jurong East', intro: 'Jurong East 是西部商业和交通中心，购物、餐饮和换乘选择多。缺点是离 NTU 不算最近，通勤时间取决于换乘和巴士连接。适合希望周末生活便利、或需要连接其他区域的学生。'},
      {title: 'Lakeside', intro: 'Lakeside 位于西部，生活环境相对安静，部分房源性价比不错。去 NTU 要看公交连接和步行距离，适合能接受稍长通勤但希望居住节奏稳定的学生。'},
      {title: 'NTU 通勤方式', intro: 'NTU 通勤通常结合 MRT、巴士和校内交通。看房时建议用上课时间段模拟路线，而不是只看周末或深夜地图结果。晚课学生尤其要确认末班车和打车成本。'},
      {title: 'NTU 附近租房价格参考', intro: 'Pioneer 和 Boon Lay 因为学生需求稳定，条件好的房源价格不一定低。Jurong West 和 Lakeside 可能有更多预算选择，Jurong East 则在生活便利度上更强。'},
      {title: '不同预算推荐', intro: '预算较低可看 Jurong West 或稍远 HDB Common Room；预算中等可看 Pioneer、Boon Lay 的普通房；预算较高可考虑 Condo、Master Room 或更靠近交通节点的房间。'},
    ],
    table: {
      caption: 'NTU 校外租房区域对比',
      headers: ['区域', '通勤特点', '生活便利', '适合人群'],
      rows: [
        ['Pioneer', '靠近 NTU 通勤节点', '基础配套够用', '重视上课便利'],
        ['Boon Lay', '路线成熟', '商场和交通方便', '希望生活稳定'],
        ['Jurong West', '差异较大', '房源层次丰富', '预算敏感'],
        ['Jurong East', '需要换乘或公交', '商业配套强', '重视周末生活'],
        ['Lakeside', '看具体公交', '安静成熟', '接受稍长通勤'],
      ],
    },
    faqs: [
      {question: 'NTU 学生校外租房首选哪里？', answer: 'Pioneer 和 Boon Lay 通常更常见，Jurong West、Jurong East、Lakeside 可按预算和生活需求比较。'},
      {question: 'NTU 住 Jurong East 方便吗？', answer: '生活方便，但去学校未必最短。建议用上课时间测算门到门通勤，再决定是否接受。'},
      {question: 'NTU 校外租房需要买交通卡吗？', answer: '通常需要。日常会频繁使用 MRT、巴士和校内交通，交通费用应纳入月预算。'},
      {question: '预算低的 NTU 学生怎么选？', answer: '可以扩大到 Jurong West 或 Lakeside，但不要牺牲基本安全、通风和合同清晰度。'},
      {question: 'NTU 晚课多要注意什么？', answer: '确认晚间巴士、校车、末班车和打车费用。不要只看白天通勤路线。'},
    ],
    relatedSlugs: ['student-rental-guide-singapore', 'best-areas-for-students-singapore', 'singapore-student-transport-guide', 'singapore-rental-scams-guide', 'hdb-vs-condo-singapore', 'singapore-student-living-cost-guide'],
  },
  'smu-rental-guide-singapore': {
    slug: 'smu-rental-guide-singapore',
    h1: 'SMU 新加坡管理大学附近租房指南',
    subtitle: 'SMU 位于市中心，可用地铁网络拓展选择。本指南比较 Dhoby Ghaut、Bugis、City Hall、Novena、Toa Payoh、Queenstown 等区域。',
    seoTitle: 'SMU 附近租房指南｜新加坡管理大学留学生租房区域与价格｜Weijie.sg',
    description: 'SMU 留学生租房指南：了解 Dhoby Ghaut、Bugis、City Hall、Novena、Toa Payoh、Queenstown 等区域的租金、通勤和生活便利度。',
    keywords: ['SMU 附近租房', '新加坡管理大学租房', 'SMU 留学生租房', 'Bugis 租房', 'Dhoby Ghaut 租房'],
    imageAlt: 'SMU 附近租房区域示意图',
    updatedAt: '2026-05-14',
    readingTime: '约 9 分钟阅读',
    lead: ['SMU 位于新加坡市中心，周边交通发达，但核心区域租金也更高。SMU 学生选房时，可以把“步行到校”和“地铁直达”都纳入比较。', '如果预算有限，不必只盯 Dhoby Ghaut 或 City Hall，Novena、Toa Payoh、Queenstown、Tiong Bahru 等区域也可能更平衡。'],
    sections: [
      {title: 'SMU 位于市中心，租房怎么选', intro: '市中心上课的好处是交通选择多，缺点是附近房租和生活成本偏高。建议先确定可接受通勤时间，再比较是否值得为步行到校支付更高租金。'},
      {title: 'Dhoby Ghaut / City Hall', intro: '这一区域离 SMU 很近，通勤便利，适合预算充足、课表密集或经常晚归的学生。房源价格通常较高，空间可能不大，需要仔细比较房间质量和合同条款。'},
      {title: 'Bugis', intro: 'Bugis 去 SMU 方便，餐饮和生活选择丰富，适合喜欢市中心生活节奏的学生。部分房源可能较旧或空间紧凑，看房时要确认隔音、通风和公共区域。'},
      {title: 'Novena', intro: 'Novena 连接市中心便利，生活配套成熟，整体居住氛围比核心商业区更安静。适合希望通勤不远、又不想住在最热闹区域的学生。'},
      {title: 'Toa Payoh', intro: 'Toa Payoh 是成熟本地生活区，HDB 选择较多，餐饮和交通便利。去 SMU 需要地铁或巴士连接，适合预算中等、重视日常生活便利的人。'},
      {title: 'Queenstown', intro: 'Queenstown 去市中心和西部都比较灵活，适合 SMU 学生兼顾学校、实习和生活。区域安静，房源类型较丰富，是常见的平衡选择。'},
      {title: 'Outram / Tiong Bahru', intro: 'Outram 和 Tiong Bahru 靠近市中心，生活质感和交通都不错。价格通常偏高，但对实习地点在 CBD 或市中心的学生很方便。'},
      {title: 'SMU 附近租房价格参考', intro: '越靠近 Dhoby Ghaut、City Hall 和 Bugis，房租通常越高。Toa Payoh、Queenstown 等区域可能在通勤和价格之间更平衡。看价格时要特别注意是否包水电网和公共区域条件。'},
      {title: '不同预算推荐', intro: '预算高可看市中心 Master Room、Studio 或 Condo；预算中等可看 Novena、Toa Payoh、Queenstown 的 Common Room；预算较低可扩大到地铁直达区域，但要控制换乘次数。'},
    ],
    table: {
      caption: 'SMU 学生常见租房区域对比',
      headers: ['区域', '离校感受', '价格感受', '适合人群'],
      rows: [
        ['Dhoby Ghaut / City Hall', '非常近', '偏高', '预算充足、课表密集'],
        ['Bugis', '很方便', '中高', '喜欢市中心生活'],
        ['Novena', '地铁通勤方便', '中高', '重视安静和配套'],
        ['Toa Payoh', '需通勤', '中等', '预算中等、生活便利'],
        ['Queenstown', '连接灵活', '中等', '兼顾学校和实习'],
      ],
    },
    faqs: [
      {question: 'SMU 学生一定要住市中心吗？', answer: '不一定。市中心方便但租金高，Novena、Toa Payoh、Queenstown 等地铁区域也很常见。'},
      {question: 'Bugis 适合 SMU 学生吗？', answer: '适合，通勤和生活都方便。但房源条件差异较大，看房时要确认空间、通风和噪音。'},
      {question: 'SMU 附近租房预算怎么定？', answer: '先决定是否愿意为步行到校支付溢价，再比较地铁 20 到 35 分钟范围内的房源。'},
      {question: '住 Queenstown 去 SMU 方便吗？', answer: '通常可以接受，具体要看离 MRT 的步行距离和换乘路线。'},
      {question: 'SMU 学生适合 Studio 吗？', answer: '适合预算较高、重视独立空间的人。预算有限时，市中心 Studio 可能会明显压缩生活费。'},
    ],
    relatedSlugs: ['student-rental-guide-singapore', 'best-areas-for-students-singapore', 'singapore-student-transport-guide', 'singapore-student-living-cost-guide', 'hdb-vs-condo-singapore', 'common-room-vs-master-room-singapore'],
  },
  'singapore-rental-contract-guide': {
    slug: 'singapore-rental-contract-guide',
    h1: '新加坡租房合同指南：留学生签约前要看懂什么',
    subtitle: '用留学生视角拆解 Lease Term、Deposit、Utilities、维修、访客、提前退租和 Inventory List。',
    seoTitle: '新加坡租房合同指南｜留学生租房押金、租期、违约和维修条款｜Weijie.sg',
    description: '新加坡留学生租房合同指南：看懂租期、押金、水电网、维修责任、提前退租、访客规则和房东条款。',
    keywords: ['新加坡租房合同', '新加坡租房押金', '新加坡租房签约', '新加坡租房提前退租', 'Tenancy Agreement Singapore'],
    imageAlt: '新加坡租房合同检查清单',
    updatedAt: '2026-05-14',
    readingTime: '约 9 分钟阅读',
    lead: ['新加坡租房合同通常叫 Tenancy Agreement。对留学生来说，合同不是形式文件，而是决定押金、维修、退租和日常规则的核心依据。', '签约前不需要把自己变成法律专家，但至少要知道哪些条款会影响钱、时间和居住自由。'],
    sections: [
      {title: '新加坡租房为什么一定要看合同', intro: '很多争议都来自“看房时说可以，但合同没写”。合同能明确双方责任，也能在退租、维修和押金扣除时提供依据。任何重要承诺都应写入合同或通过文字确认。'},
      {title: '租期 Lease Term', intro: '租期决定你要住多久、什么时候开始付租、是否能续租。留学生要特别注意课程结束、假期、实习和回国时间，避免租期和学期安排冲突。'},
      {title: '押金 Deposit', intro: '押金金额、用途、退还时间和扣款标准必须清楚。入住前拍摄房间和家具状态，退租时对照 Inventory List，可以减少不必要扣款争议。'},
      {title: '水电网 Utilities', intro: '合同应说明水、电、网是否包含在租金内，是否有上限，空调用电是否另算。所谓“包水电网”也要问清超额费用怎么分摊。'},
      {title: '空调清洗 Aircon Servicing', intro: '新加坡租房常见空调清洗要求，可能按季度或固定周期进行。合同里要写清谁预约、谁付款、是否需要保留收据。'},
      {title: '维修责任', intro: '小额维修、自然损耗和人为损坏的责任边界要明确。入住时已有问题应拍照记录，避免退租时被算作租客责任。'},
      {title: '访客和做饭规则', intro: '部分房东会限制访客留宿、做饭时间、油烟、公共区域使用和洗衣频率。规则如果影响你的生活习惯，应在签约前确认，而不是入住后再协商。'},
      {title: '提前退租条款', intro: '提前退租通常涉及违约金、找替租、通知期和押金处理。留学生课程变化较多，应重点看是否有 Diplomatic Clause 或替租安排。'},
      {title: 'Inventory List', intro: 'Inventory List 是家具、电器和房屋状态清单。入住时逐项核对床、桌、椅、衣柜、空调、洗衣机、冰箱和钥匙数量，并拍照保存。'},
      {title: '签约前 checklist', intro: '签约前确认租客姓名、房屋地址、房间类型、租期、租金、押金、付款方式、维修规则、退租条款和入住清单。付款后保存收据和合同扫描件。'},
    ],
    table: {
      caption: '新加坡租房合同重点条款',
      headers: ['条款', '要看什么', '为什么重要'],
      rows: [
        ['Lease Term', '开始和结束日期', '避免和学期、实习冲突'],
        ['Deposit', '金额、退还、扣款标准', '减少押金争议'],
        ['Utilities', '是否包含和上限', '避免入住后费用超预算'],
        ['Aircon Servicing', '频率和付款方', '新加坡常见费用点'],
        ['Early Termination', '通知期和违约责任', '应对课程变化或转租'],
      ],
    },
    faqs: [
      {question: '新加坡租房合同一定要英文吗？', answer: '正式合同通常为英文。可以请人解释或自行翻译，但签署前应以正式文本为准逐条确认。'},
      {question: '押金什么时候退？', answer: '取决于合同约定和退房检查。常见做法是在退房、结清费用和确认无损坏后退还。'},
      {question: '提前退租一定会扣押金吗？', answer: '不一定，要看合同。可能涉及通知期、违约金、找替租或其他费用。签约前必须看清。'},
      {question: '空调清洗为什么要写进合同？', answer: '因为新加坡房东常要求定期清洗空调。频率、费用和收据责任不清楚时，退租容易争议。'},
      {question: 'Inventory List 不完整怎么办？', answer: '入住时补拍照片并发给房东或中介确认，最好让对方文字回复。不要等退租时才提出。'},
    ],
    relatedSlugs: ['student-rental-guide-singapore', 'singapore-rental-scams-guide', 'singapore-agent-fee-rental-guide', 'common-room-vs-master-room-singapore', 'hdb-vs-condo-singapore', 'singapore-student-living-cost-guide'],
  },
  'singapore-agent-fee-rental-guide': {
    slug: 'singapore-agent-fee-rental-guide',
    h1: '新加坡租房中介费怎么算？留学生租房必看',
    subtitle: '解释租客中介、房东中介、No Agent Fee、佣金计算和付款前确认事项。',
    seoTitle: '新加坡租房中介费怎么算｜租客要不要付中介费｜Weijie.sg',
    description: '新加坡租房中介费指南：解释租客什么时候需要付中介费、No Agent Fee 是什么意思、如何避免重复付费和签约前注意事项。',
    keywords: ['新加坡租房中介费', '新加坡租房 agent fee', '新加坡 no agent fee', '新加坡租房佣金', '新加坡租房中介'],
    imageAlt: '新加坡租房中介费说明图',
    updatedAt: '2026-05-14',
    readingTime: '约 7 分钟阅读',
    lead: ['新加坡租房中介费最容易让留学生困惑：为什么有些房源写 No Agent Fee，有些又要租客付佣金？关键在于中介代表谁，以及你是否委托了租客中介。', '付款前要把服务关系、费用金额、收款方和合同写清楚，避免重复付费。'],
    sections: [
      {title: '新加坡租房为什么会有中介费', intro: '中介费本质上是对找房、带看、谈判、合同和交接服务的费用。不同房源里，中介可能代表房东，也可能代表租客。谁委托服务，通常决定谁承担费用。'},
      {title: '租客什么时候需要付中介费', intro: '如果你主动委托租客中介帮你找房、约看、谈条件和处理合同，通常需要支付中介费。具体金额要在服务开始前确认，不要等签约时才被动接受。'},
      {title: 'No Agent Fee 是什么意思', intro: 'No Agent Fee 通常指租客不需要支付房东中介的佣金，但不等于所有情况下都没有费用。如果你另找了租客中介，仍可能需要向自己的中介付费。'},
      {title: '房东中介 vs 租客中介', intro: '房东中介主要代表房东出租房源，租客中介主要代表租客找房。留学生要知道对方站在哪一边，哪些建议是服务你，哪些是服务房东。'},
      {title: '中介费常见计算方式', intro: '中介费可能按半个月租金、一个月租金或固定费用计算，和租期、租金、服务范围有关。不要只问“多少”，还要问包含哪些服务、什么时候支付、是否开收据。'},
      {title: '如何避免重复付费', intro: '不要同时让多个中介代表你谈同一个房源，也不要在不清楚代理关系时随意签委托。看到房源后，要确认 listing agent 和 tenant agent 是否不同。'},
      {title: '付款前要确认什么', intro: '确认中介姓名、执照或公司信息、服务范围、费用金额、付款时间、收据和合同。任何费用都不应只靠语音或口头说明。'},
    ],
    table: {
      caption: '新加坡租房中介费场景对比',
      headers: ['场景', '租客是否常见付费', '需要确认'],
      rows: [
        ['直接联系房东房源', '通常无租客中介费', '房东身份和合同'],
        ['联系房东中介房源', '可能 No Agent Fee', '是否仅代表房东'],
        ['委托租客中介找房', '通常需要', '佣金和服务范围'],
        ['多个中介参与', '风险较高', '代理关系和是否重复收费'],
        ['短租或平台房源', '视平台规则', '服务费、清洁费和退款'],
      ],
    },
    faqs: [
      {question: 'No Agent Fee 就完全不用付钱吗？', answer: '不一定。它通常指租客不用付房东中介费，但仍要看是否有平台服务费、清洁费或你自己的租客中介费。'},
      {question: '中介费什么时候付比较合理？', answer: '通常应在服务关系、房源、合同和费用明确后支付，并要求收据。不要在没有任何书面确认时提前转账。'},
      {question: '可以不通过中介租房吗？', answer: '可以，但需要自己核验房东身份、合同、押金和房屋状态。新生如果经验不足，中介服务有时能节省时间，但费用要透明。'},
      {question: '租客中介和房东中介有什么区别？', answer: '租客中介代表租客找房和谈条件，房东中介代表房东出租房源。服务对象不同，费用承担也可能不同。'},
      {question: '中介费能讲价吗？', answer: '部分情况下可以协商，但应以专业服务和透明条款为前提，不要只追求最低费用而忽略服务边界。'},
    ],
    relatedSlugs: ['singapore-rental-contract-guide', 'singapore-rental-scams-guide', 'student-rental-guide-singapore', 'best-areas-for-students-singapore', 'hdb-vs-condo-singapore', 'common-room-vs-master-room-singapore'],
  },
  'hdb-vs-condo-singapore': {
    slug: 'hdb-vs-condo-singapore',
    h1: '新加坡 HDB 和 Condo 有什么区别？留学生租房怎么选',
    subtitle: '从价格、设施、交通、生活便利、管理和适合人群比较组屋与私人公寓。',
    seoTitle: '新加坡 HDB vs Condo｜留学生租房选组屋还是公寓｜Weijie.sg',
    description: '新加坡 HDB 和 Condo 租房区别：比较价格、设施、交通、生活便利度、室友环境、安全性和适合人群。',
    keywords: ['HDB vs Condo Singapore', '新加坡 HDB Condo 区别', '新加坡组屋公寓区别', '留学生租 HDB 还是 Condo'],
    imageAlt: '新加坡 HDB 和 Condo 区别示意图',
    updatedAt: '2026-05-14',
    readingTime: '约 8 分钟阅读',
    lead: ['HDB 和 Condo 是新加坡留学生最常见的两类校外住房。它们不是简单的“便宜”和“贵”的区别，而是代表不同生活方式。', 'HDB 更贴近本地社区和日常便利，Condo 更强调设施、门禁和小区管理。适合哪一种，取决于预算、通勤、隐私和生活习惯。'],
    sections: [
      {title: 'HDB 和 Condo 分别是什么', intro: 'HDB 是新加坡公共组屋，覆盖范围广，生活配套强；Condo 是私人公寓，通常带门禁、泳池、健身房等设施。留学生租到的通常是其中一个房间，或少数情况下整套。'},
      {title: '价格区别', intro: 'HDB 普通房通常比 Condo 更友好，适合预算有限的学生。Condo 因设施、管理和小区环境，价格通常更高。具体价格还要看区域、屋龄、地铁距离和是否包水电网。'},
      {title: '设施区别', intro: 'Condo 常见设施包括泳池、健身房、烧烤区、门禁和保安；HDB 通常没有小区级私人设施，但楼下生活配套可能更丰富。设施是否值得付费，要看你是否真的会使用。'},
      {title: '交通和生活便利度', intro: '很多 HDB 位于成熟社区，靠近食阁、超市、巴士站和诊所。Condo 也可能很方便，但部分小区离地铁有一段距离。看房时要看门到门通勤，而不是只看小区名称。'},
      {title: '居住环境', intro: 'HDB 更生活化，邻里氛围明显；Condo 更统一，公共区域管理更清楚。合租体验最终仍取决于房东、室友和规则。'},
      {title: '安全和管理', intro: 'Condo 通常有门禁和保安，访客管理更明确。HDB 公共空间开放，但新加坡整体安全感较高。学生应重点看门锁、楼道、夜间路线和室友结构。'},
      {title: '留学生怎么选', intro: '预算优先选 HDB，设施和管理优先看 Condo；通勤优先时两者都要按具体地址比较。不要为了住 Condo 接受过远通勤，也不要为了低价 HDB 接受明显不舒适或合同不清楚的房间。'},
      {title: '对比表', intro: '下面的表格适合第一次筛选房源时使用。最终判断仍要结合具体房间、室友、合同和路线。'},
    ],
    table: {
      caption: 'HDB 与 Condo 租房对比',
      headers: ['维度', 'HDB 组屋', 'Condo 私人公寓'],
      rows: [
        ['价格', '通常更友好', '通常更高'],
        ['设施', '依赖周边公共配套', '常有泳池、健身房、门禁'],
        ['生活便利', '食阁和超市常见', '看小区位置'],
        ['管理', '规则由房东和单位决定', '小区管理更统一'],
        ['适合人群', '预算敏感、重视本地生活', '重视设施、隐私和小区环境'],
      ],
    },
    faqs: [
      {question: '留学生租 HDB 合适吗？', answer: '合适。HDB 是很多学生的常见选择，价格和生活便利度通常不错。关键是看房间、室友和合同。'},
      {question: 'Condo 一定比 HDB 安全吗？', answer: 'Condo 通常有门禁和保安，但安全感也取决于具体小区、路线和室友。不要只凭类型判断。'},
      {question: 'HDB 可以做饭吗？', answer: '要看房东规则。部分 HDB 合租允许轻煮，部分限制油烟或做饭时间，签约前要问清。'},
      {question: '预算有限应该优先看哪种？', answer: '通常先看 HDB Common Room，同时确保通勤、通风和合同清楚。'},
      {question: 'Condo 的设施费要单独付吗？', answer: '租房广告通常不会单独列设施费，但租金已反映设施和管理成本。仍要确认设施是否对租客开放。'},
    ],
    relatedSlugs: ['student-rental-guide-singapore', 'common-room-vs-master-room-singapore', 'best-areas-for-students-singapore', 'singapore-rental-contract-guide', 'singapore-rental-scams-guide', 'singapore-student-living-cost-guide'],
  },
  'common-room-vs-master-room-singapore': {
    slug: 'common-room-vs-master-room-singapore',
    h1: 'Common Room 和 Master Room 有什么区别？新加坡留学生租房必看',
    subtitle: '比较普通房和主人房在卫生间、价格、隐私、空间和适合人群上的差异。',
    seoTitle: 'Common Room vs Master Room｜新加坡普通房和主人房区别｜Weijie.sg',
    description: '新加坡租房中 Common Room 和 Master Room 的区别：比较价格、厕所、隐私、空间、适合人群和留学生预算建议。',
    keywords: ['Common Room Master Room 区别', '新加坡普通房 主人房', '新加坡 Common Room', '新加坡 Master Room', '留学生租房房型'],
    imageAlt: '新加坡 Common Room 和 Master Room 区别示意图',
    updatedAt: '2026-05-14',
    readingTime: '约 7 分钟阅读',
    lead: ['Common Room 和 Master Room 是新加坡租房广告里最常见的房间类型。它们的核心区别通常是是否带独立卫生间，进而影响价格、隐私和日常体验。', '留学生选择时，不要只看月租，还要看卫生间共用人数、房间面积、书桌空间、空调规则和室友作息。'],
    sections: [
      {title: 'Common Room 是什么', intro: 'Common Room 通常指普通卧室，不带独立卫生间，需要和其他室友共用浴室。它是新加坡留学生最常见的合租选择，价格相对友好，适合单人或预算有限的学生。'},
      {title: 'Master Room 是什么', intro: 'Master Room 通常是主人房，带独立卫生间，面积更大，隐私更好。价格通常明显高于 Common Room，适合预算更充足、重视隐私或两人分摊租金的情况。'},
      {title: '最大区别：是否带独立卫生间', intro: '独立卫生间会减少早晚高峰等待和清洁分歧，也让生活节奏更独立。共用卫生间则需要看室友人数、清洁频率和使用习惯。'},
      {title: '价格区别', intro: '同一套房里，Master Room 通常比 Common Room 贵。不同区域之间差距也很大，市中心 Common Room 可能比远一些区域的 Master Room 更贵。'},
      {title: '隐私和生活体验', intro: 'Master Room 的隐私感更强，适合需要安静学习、作息不固定或对卫生间使用很敏感的学生。Common Room 更考验室友沟通和公共空间规则。'},
      {title: '情侣/朋友/单人怎么选', intro: '单人预算有限优先看 Common Room；情侣或两位朋友合住可以比较 Master Room，但要确认房东是否允许两人入住，以及水电网是否会加价。'},
      {title: '对比表', intro: '房间类型只是第一步。看房时还要确认窗户、采光、空调、家具、公共区域和合同规则。'},
    ],
    table: {
      caption: 'Common Room 与 Master Room 对比',
      headers: ['维度', 'Common Room', 'Master Room'],
      rows: [
        ['卫生间', '通常共用', '通常独立'],
        ['价格', '更友好', '更高'],
        ['隐私', '取决于室友和规则', '更好'],
        ['适合', '单人、预算有限', '重视隐私、两人合住'],
        ['注意', '共用人数和清洁', '是否允许双人入住'],
      ],
    },
    faqs: [
      {question: 'Common Room 一定不带卫生间吗？', answer: '通常不带独立卫生间，但具体房源可能有特殊布局。看房时要直接确认。'},
      {question: 'Master Room 可以两个人住吗？', answer: '要看房东和合同是否允许。即使允许，也要确认水电网、访客和押金是否会调整。'},
      {question: '预算有限选 Common Room 会不会不舒服？', answer: '不一定。位置好、室友少、规则清楚的 Common Room 也可以很舒适。重点是共用卫生间人数和公共区域维护。'},
      {question: '女生租房更适合 Master Room 吗？', answer: '不一定。Master Room 隐私更好，但安全感还取决于室友、门锁、楼栋和路线。'},
      {question: '看房时怎么判断房间够不够用？', answer: '确认床、书桌、衣柜、行李箱和走动空间。对学生来说，能否稳定学习比照片好看更重要。'},
    ],
    relatedSlugs: ['student-rental-guide-singapore', 'hdb-vs-condo-singapore', 'singapore-rental-contract-guide', 'singapore-rental-scams-guide', 'best-areas-for-students-singapore', 'singapore-student-living-cost-guide'],
  },
  'singapore-student-living-cost-guide': {
    slug: 'singapore-student-living-cost-guide',
    h1: '新加坡留学生生活成本指南：租房、吃饭、交通一个月多少钱',
    subtitle: '整理租房、餐饮、交通、电话卡、水电网和日常杂费，帮助学生建立月度预算。',
    seoTitle: '新加坡留学生生活成本 2026｜租房、吃饭、交通、电话费预算｜Weijie.sg',
    description: '2026 新加坡留学生生活成本指南：整理租房、吃饭、交通、电话卡、水电网、日常开销和不同预算档位。',
    keywords: ['新加坡留学生生活成本', '新加坡留学一个月多少钱', '新加坡学生生活费', '新加坡租房生活费', 'Singapore student living cost'],
    imageAlt: '新加坡留学生生活成本预算表',
    updatedAt: '2026-05-14',
    readingTime: '约 8 分钟阅读',
    lead: ['新加坡留学生生活成本最大的一项通常是租房，其次是吃饭、交通、电话卡、水电网和日常用品。预算不能只看房租，还要看生活方式。', '这篇指南提供的是预算框架，不使用虚假精确数字。不同学校、区域、房型和个人习惯都会让月度成本明显变化。'],
    sections: [
      {title: '新加坡留学生每月主要开销有哪些', intro: '主要开销包括房租、押金摊销、餐饮、交通、电话卡、网络、水电、学习材料、日用品、医疗保险和社交活动。新生还会有床品、转换插头和搬家等一次性费用。'},
      {title: '租房成本', intro: '租房通常占月预算最大比例。HDB Common Room、Condo Common Room、Master Room、Studio 和学生公寓价格层次不同。要把是否包水电网、空调清洗和中介费一起算入。'},
      {title: '吃饭成本', intro: '学校餐厅、食阁和熟食中心通常更适合日常预算；商场餐厅、外卖和咖啡饮品会明显提高支出。能否做饭也会影响长期成本。'},
      {title: '交通成本', intro: '新加坡 MRT 和巴士网络成熟，但每天通勤距离仍会影响月度交通费。住得远可能省房租，却增加时间和交通成本。'},
      {title: '电话卡和网络', intro: '本地电话卡、eSIM、宽带和房间网络规则要提前确认。有些房租包含网络，有些需要室友分摊或自行办理。'},
      {title: '水电网费用', intro: '水电网是否包含在租金内差异很大。空调使用频率会影响电费，合租时还要看分摊方式是否公平透明。'},
      {title: '学习和生活杂费', intro: '教材、打印、电脑配件、日用品、洗衣、理发、看诊和社交活动都应留出弹性预算。预算过紧会让遇到突发情况时很被动。'},
      {title: '不同预算档位', intro: '低预算应优先保证安全和稳定通勤；中等预算可以在房型和区域之间平衡；高预算可追求独立空间、设施和更短通勤。每个档位都要预留应急金。'},
      {title: '省钱建议', intro: '优先选择通勤稳定且生活配套成熟的区域，减少外卖和临时打车；看房时问清水电网；大件物品可考虑二手；开学初不要一次性购买太多非必需品。'},
    ],
    table: {
      caption: '新加坡留学生月度预算拆分',
      headers: ['支出项', '影响因素', '控制建议'],
      rows: [
        ['租房', '区域、房型、是否包费用', '先定预算上限'],
        ['吃饭', '食阁、学校餐厅、外卖频率', '日常以食阁和学校为主'],
        ['交通', '通勤距离和换乘', '按门到门时间选址'],
        ['通讯', '电话卡、网络是否包含', '比较学生套餐和合租分摊'],
        ['杂费', '学习、医疗、社交', '保留应急预算'],
      ],
    },
    faqs: [
      {question: '新加坡留学生一个月多少钱够用？', answer: '取决于房租和生活方式。建议先单独估算住宿，再加餐饮、交通、通讯和杂费，并预留应急金。'},
      {question: '房租包水电网更好吗？', answer: '不一定。包费用方便预算，但要问清是否有上限、空调是否另算、超额如何分摊。'},
      {question: '住远一点一定更省钱吗？', answer: '不一定。远区域可能房租低，但交通时间、交通费和晚间打车成本可能增加。'},
      {question: '新生第一月为什么更贵？', answer: '因为有押金、床品、日用品、交通卡、电话卡和搬家等一次性成本。'},
      {question: '如何避免生活费失控？', answer: '把固定支出和可变支出分开记录，外卖、打车、咖啡和临时购物通常是最容易超预算的部分。'},
    ],
    relatedSlugs: ['student-rental-guide-singapore', 'best-areas-for-students-singapore', 'singapore-student-transport-guide', 'hdb-vs-condo-singapore', 'common-room-vs-master-room-singapore', 'singapore-rental-contract-guide'],
  },
  'singapore-student-transport-guide': {
    slug: 'singapore-student-transport-guide',
    h1: '新加坡留学生交通指南：地铁、巴士、通勤和租房选址',
    subtitle: '理解 MRT、巴士、换乘、通勤时间和交通费用，用交通视角反推租房区域。',
    seoTitle: '新加坡留学生交通指南｜MRT、巴士、通勤时间与租房区域选择｜Weijie.sg',
    description: '新加坡留学生交通指南：了解 MRT 地铁、巴士、换乘、通勤时间、交通费用，以及如何根据学校位置选择租房区域。',
    keywords: ['新加坡留学生交通', '新加坡 MRT 租房', '新加坡通勤指南', '新加坡学生交通费', '新加坡租房地铁'],
    imageAlt: '新加坡留学生交通和租房选址示意图',
    updatedAt: '2026-05-14',
    readingTime: '约 8 分钟阅读',
    lead: ['在新加坡租房，交通决定了每天的真实成本。房租便宜但通勤太长，可能会消耗睡眠、学习时间和社交机会。', '留学生选址时，建议用 MRT、巴士、步行和换乘共同判断，不要只看地图上的直线距离。'],
    sections: [
      {title: '新加坡交通为什么影响租房选择', intro: '新加坡公共交通发达，但学校位置、上课时间和居住区域会让体验差异很大。稳定通勤能降低迟到风险，也能让日常生活更可控。'},
      {title: 'MRT 地铁怎么理解', intro: 'MRT 是新加坡通勤骨架，适合跨区域移动。看房时要确认住处到 MRT 的步行时间、是否需要换乘、学校到站后的接驳，以及晚间末班车。'},
      {title: '巴士通勤适合哪些区域', intro: '很多学校和住宅区离 MRT 还有一段距离，巴士能补足最后一公里。NTU、NUS 部分区域尤其要重视巴士路线和班次稳定性。'},
      {title: '通勤时间怎么判断', intro: '通勤应按门到门计算，包括下楼、步行、等车、换乘、进校和从校门到教室的时间。地图显示 25 分钟，实际高峰期可能更久。'},
      {title: 'NUS、NTU、SMU 通勤建议', intro: 'NUS 可看 Clementi、Dover、Buona Vista、Queenstown；NTU 重点看 Pioneer、Boon Lay、Jurong West；SMU 可用市中心地铁网络拓展到 Novena、Toa Payoh、Queenstown 等区域。'},
      {title: '交通费用参考', intro: '交通费用和通勤频率相关。住得远不一定省钱，如果每周频繁往返学校、市中心和活动地点，时间成本和费用都要算入预算。'},
      {title: '租房选址建议', intro: '优先选择换乘少、步行可控、晚间路线清楚的房源。女生、晚课多或经常小组讨论的学生，应特别看夜间回家是否方便。'},
      {title: '交通和生活平衡', intro: '交通好不等于只住地铁站旁。附近是否有食阁、超市、诊所和安静学习环境，也会影响长期体验。选址时应把通勤和生活配套放在同一张表里比较。'},
    ],
    table: {
      caption: '交通视角下的租房选址对比',
      headers: ['选址方式', '优势', '风险', '适合人群'],
      rows: [
        ['靠近学校', '通勤短', '房源少或价格高', '课多、新生'],
        ['靠近 MRT', '跨区方便', '离学校可能还需接驳', '常去市中心或实习'],
        ['靠近巴士直达', '门到门稳定', '班次影响体验', 'NUS / NTU 学生'],
        ['住成熟社区', '生活便利', '通勤需测算', '重视日常配套'],
        ['住远郊低价区', '房租可能较低', '时间成本高', '预算非常敏感'],
      ],
    },
    faqs: [
      {question: '新加坡租房一定要靠近 MRT 吗？', answer: '不一定。靠近直达巴士或学校接驳也可以。关键是门到门时间稳定。'},
      {question: '通勤多久算合适？', answer: '很多学生会把 30 到 45 分钟门到门作为可接受范围，但课表、晚归和个人耐受度不同。'},
      {question: 'NTU 学生只看地铁站够吗？', answer: '不够。NTU 校园和周边接驳很重要，要看地铁后如何到校园内部。'},
      {question: '交通费会不会很高？', answer: '通常可控，但频繁跨区、打车和住得很远会增加成本。预算时要结合每周出行频率。'},
      {question: '晚课学生选房要注意什么？', answer: '确认末班车、夜间巴士、步行路线照明和打车成本，不要只看白天路线。'},
    ],
    relatedSlugs: ['best-areas-for-students-singapore', 'nus-rental-guide-singapore', 'ntu-rental-guide-singapore', 'smu-rental-guide-singapore', 'student-rental-guide-singapore', 'singapore-student-living-cost-guide'],
  },
};

export const rentalSeoSlugs = Object.keys(rentalSeoPages);

export function getRentalSeoPage(slug: string) {
  return rentalSeoPages[slug];
}

export function getRelatedLinks(page: RentalSeoPage): RelatedLink[] {
  const slugs = page.relatedSlugs.length >= 5 ? page.relatedSlugs : commonRelatedFallback;
  return slugs
    .filter((slug) => slug !== page.slug)
    .map((slug) => rentalSeoPages[slug])
    .filter(Boolean)
    .slice(0, 6)
    .map((item) => ({
      title: item.h1.replace('（2026最新版）', ''),
      href: `/${item.slug}`,
      description: item.description,
    }));
}

export function buildRentalMetadata(page: RentalSeoPage): Metadata {
  return {
    title: {
      absolute: page.seoTitle,
    },
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: `/${page.slug}`,
    },
    openGraph: {
      title: page.seoTitle,
      description: page.description,
      url: `${SITE_URL}/${page.slug}`,
      siteName: '维界 Weijie.sg',
      locale: 'zh_CN',
      type: 'article',
      images: [
        {
          url: '/weijie-logo-icon.png',
          alt: page.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seoTitle,
      description: page.description,
      images: ['/weijie-logo-icon.png'],
    },
  };
}

export function buildJsonLd(page: RentalSeoPage) {
  const url = `${SITE_URL}/${page.slug}`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.h1,
      description: page.description,
      inLanguage: 'zh-CN',
      dateModified: page.updatedAt,
      datePublished: page.updatedAt,
      url,
      author: {
        '@type': 'Organization',
        name: '维界',
        url: SITE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: '维界',
        url: SITE_URL,
      },
      mainEntityOfPage: url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '首页',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '新加坡留学生租房',
          item: `${SITE_URL}/student-rental-guide-singapore`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: page.h1,
          item: url,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];
}
