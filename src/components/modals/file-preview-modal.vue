<template>
  <b-modal :id="modalId" :title="resource.name" size="lg">
    <div>
      <div>
        <b-button variant="link" size="sm" v-b-modal="`share-modal`"
                  v-b-tooltip.hover="`Share`">
          <b-icon icon="share"></b-icon>
          Share
        </b-button>
        <ModalShareEntity :modal-id="`share-modal`"
                          :entity-id="resource.resourceId"/>


        <b-button variant="link" v-b-modal="`map-to-collection-groups-modal`">
          <b-icon icon="folder"></b-icon>
          Group Collections
        </b-button>
        <MapSelectedFilesAndFoldersToCollectionGroupsModal modal-id="map-to-collection-groups-modal"
                                                           :resource-ids="[resourceId]"/>

        <b-button variant="link" size="sm" v-b-tooltip.hover="`Delete`">
          <b-icon icon="trash"></b-icon>
          Delete
        </b-button>

        <b-button variant="link" size="sm" v-b-tooltip.hover="`Notes`"
                  v-b-modal="`file-notes-modal`">
          <b-icon icon="chat-square-text"></b-icon>
          Notes
        </b-button>
        <NotesModal :modal-id="`file-notes-modal`" :resource-id="resourceId"/>

      </div>
      <div style="display: flex; flex-direction: row;">
        <!--        <div>{{ file }}</div>-->
        <b-button variant="link" v-on:click="$emit('left')">
          <b-icon icon="arrow-left"></b-icon>
        </b-button>
        <b-icon icon="image" style="width: 100%;height: 300px;"></b-icon>
        <b-button variant="link" v-on:click="$emit('right')">
          <b-icon icon="arrow-right"></b-icon>
        </b-button>
      </div>
    </div>
    <template #modal-footer="{close}">
      <b-button size="sm" variant="outline-primary" v-on:click="close()">
        Close
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import store from "../../store";

import MapSelectedFilesAndFoldersToCollectionGroupsModal
  from "@/components/modals/map-selected-files-and-folders-to-collection-groups-modal";
import ModalShareEntity from "airavata-custos-portal/src/lib/components/modals/modal-share-entity";
import NotesModal from "@/components/modals/notes-modal";


export default {
  name: "file-preview-modal",
  store: store,
  components: {
    ModalShareEntity, NotesModal, MapSelectedFilesAndFoldersToCollectionGroupsModal
  },
  props: {
    modalId: {default: ""},
    resourceId: {default: ""}
  },
  data() {
    return {}
  },
  computed: {
    resource() {
      return this.$store.getters["emcResource/getResource"]({resourceId: this.resourceId});
    }
  }
}
</script>

<style scoped>

</style>