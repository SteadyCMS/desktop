import { ref } from 'vue';


  // List of block types
  export const blockTypes = ref([
    {
      name: "heading",
      icon: "_",
      id: 1
    },
    {
      name: "paragraph",
      icon: "_",
      id: 2
    },
    {
      name: "quote",
      icon: "_",
      id: 3
    }, 
    {
      name: "image",
      icon: "_",
      id: 4
    },  
    {
      name: "list",
      icon: "_",
      id: 5
    },  
    {
      name: "other",
      icon: "_",
      id: 6
    },
  ]);

  // Properties to be passed in for main blocks
  export function currentblockproperties(_item, _blocks) {
    let blockProperties = {};
    switch(_item.type) {
      case "paragraph":
        blockProperties = { item: _item, blocks: _blocks };
        break;
      case "heading":
        blockProperties = { item: _item, blocks: _blocks };
        break;
      case "list":
        blockProperties = { item: _item, blocks: _blocks };
        break;
      case "image":
        blockProperties = { item: _item, blocks: _blocks };
        break;
      case "quote":
        blockProperties = { item: _item, blocks: _blocks };
        break;
      default:
        blockProperties = { item: _item, blocks: _blocks };
    } 
    return blockProperties;
  }

  // Properties to be passed in for blocks top bar
  export function currentblockBarproperties(_item) {
    let blockProperties = {};
    switch(_item.type) {
      case "paragraph":
        blockProperties = { item: _item };
        break;
      case "heading":
        blockProperties = { item: _item };
        break;
      case "list":
        blockProperties = { item: _item };
        break;
      case "image":
        blockProperties = { item: _item };
        break;
     case "quote":
       blockProperties = { item: _item };
       break;
      default:
        blockProperties = { item: _item };
    } 
    return blockProperties;
  }

