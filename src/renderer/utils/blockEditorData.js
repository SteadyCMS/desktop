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
      name: "image",
      icon: "_",
      id: 3
    },  
    {
      name: "list",
      icon: "_",
      id: 4
    },  
    {
      name: "other",
      icon: "_",
      id: 5
    },
  ]);

  // Properties to be passed in for main blocks
  export function currentblockproperties(_item) {
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
      default:
        blockProperties = { item: _item };
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
      default:
        blockProperties = { item: _item };
    } 
    return blockProperties;
  }

