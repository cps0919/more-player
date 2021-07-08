import MorePlayer from '@/components/more-player.vue'

export default {
    install: (app: any) => {
        app.component(MorePlayer.name, MorePlayer)
    },
    MorePlayer
}