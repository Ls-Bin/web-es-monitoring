# web-es-monitoring
use Elasticsearch + kibana
# Feature 
 * web 
    * js error
    * api request
    * document performance
    * resource load
    * pv/uv
    * web white screen


# elasticsearch install
1. `$ sudo docker pull elasticsearch:7.17.1`
1. `$ sudo docker images`
   ```
 
   test@u20:~$ sudo docker images
   REPOSITORY           TAG       IMAGE ID       CREATED        SIZE
   elasticsearch        7.17.1    515ab4fba870   2 months ago   618MB

   ```
1. `$ sudo docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "ES_JAVA_OPTS=-Xms64m -Xmx128m" elasticsearch:7.17.1 `
1. `$ sudo docker ps`
1. open url  `http://192.168.2.253:9200/`

# kibana install
1. `$ sudo docker pull kibana:7.17.1`
   ```
   # -e : 指定环境变量配置, 提供汉化
   # --like : 建立两个容器之间的关联, kibana 关联到 es
   $ sudo docker run -d --name kibana --link elasticsearch:elasticsearch -e "I18N_LOCALE=zh-CN" -e NODE_OPTIONS:"--max-old-space-size=512" -p 5601:5601 kibana:7.17.1
   ```
1.  open url  `http://192.168.2.253:5601/`



