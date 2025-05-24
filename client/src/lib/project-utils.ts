// Project utilities

export function getProjectLogo(category: string): string {
  switch (category?.toLowerCase()) {
    case 'gitcoin':
      return '/platform-logos/gitcoin.png';
    case 'giveth':
      return '/platform-logos/giveth.png';
    case 'karma':
      return '/platform-logos/karma.png';
    case 'defi':
      return '/category-logos/defi.png';
    case 'nft':
      return '/category-logos/nft.png';
    case 'dao':
      return '/category-logos/dao.png';
    case 'infrastructure':
      return '/category-logos/infrastructure.png';
    case 'public_goods':
      return '/category-logos/public-goods.png';
    case 'social':
      return '/category-logos/social.png';
    default:
      return '/placeholder-logo.png';
  }
}

export function getCategoryName(category: string): string {
  switch (category?.toLowerCase()) {
    case 'gitcoin':
      return 'Gitcoin';
    case 'giveth':
      return 'Giveth';
    case 'karma':
      return 'Karma';
    case 'defi':
      return 'DeFi';
    case 'nft':
      return 'NFT';
    case 'dao':
      return 'DAO';
    case 'infrastructure':
      return 'Infrastructure';
    case 'public_goods':
      return 'Public Goods';
    case 'social':
      return 'Social';
    default:
      return category || 'Unknown';
  }
}
