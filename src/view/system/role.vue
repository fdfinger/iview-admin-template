<template>
  <div>
    <div style="margin-top:20px">
      <div style="padding-bottom:10px;">
        <Button type="primary" icon="md-person-add" @click="roleModal()">新增角色</Button>
      </div>
      <table class="table padding-10 hover hide-checkbox-label">
        <tr class="header">
          <td width="35%">角色名称</td>
          <td class="center">角色代码</td>
          <td class="center">操作</td>
        </tr>
        <tbody>
          <tr class="center" v-for="(role,i) in roles" :key="i">
            <td>{{role.name}}</td>
            <td class="center">{{role.code}}</td>
            <td class="center">
              <ButtonGroup>
                <Button
                  type="primary"
                  ghost
                  style="width:100px;"
                  @click="setUserRoleModal(role)"
                >设置用户</Button>
                <Button type="primary" ghost style="width:100px;" @click="setMenuModal(role)">设置菜单</Button>
              </ButtonGroup>
              <ButtonGroup style="margin-left:15px;">
                <Button type="primary" icon="md-build" @click="roleModal(role)">编辑</Button>
                <Button type="error" ghost icon="md-trash" @click="deleteRole(role,i)">删除</Button>
              </ButtonGroup>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Modal
      v-model="roleModalShow"
      :loading="saveLoading"
      :title="roleFormData.id?'编辑角色':'新增角色'"
      @on-ok="saveRole"
    >
      <div>
        <Form
          ref="formValidate"
          :model="roleFormData"
          :rules="formValidate"
          :label-width="100"
          style="padding-right:10%"
        >
          <FormItem label="角色名称" prop="name">
            <Input v-model="roleFormData.name"/>
          </FormItem>
          <FormItem label="角色代码" prop="code">
            <Input v-model="roleFormData.code"/>
          </FormItem>
        </Form>
      </div>
    </Modal>
    <Modal
      v-model="userModalShow"
      :title="'设置用户 - '+userFromData.role.name"
      width="480"
      footer-hide
    >
      <div v-if="userFromData.fromUsers" style="margin:5px auto">
        <Transfer
          :data="userFromData.fromUsers"
          :titles="['未绑定','已绑定']"
          :target-keys="userFromData.targetUsers"
          :operations="['移除','增加']"
          filterable
          @on-change="setChange"
          class="transfer-set"
        ></Transfer>
      </div>
    </Modal>
    <Modal v-model="menuModalShow" footer-hide :title="'配置菜单权限 - '+menuFromData.role.name">
      <div class="menu-list scrollbar">
        <CellGroup>
          <template v-for="menu in menuFromData.menuList">
            <Cell class="menu-list-dir" :key="menu.id.toString()">
              <span style="font-weight:bold">{{menu.name}}</span>
              <Icon :type="menu.logo" slot="icon" size="16" style="vertical-align: -1px"/>
              <i-switch v-model="menu.switch" @on-change="changeMenu(menu)" slot="extra"/>
            </Cell>
            <template v-for="item in menu.children">
              <Cell
                :title="item.name"
                class="menu-list-menu"
                :style="item.children.length>0?'border:none':''"
                :key="item.id.toString()"
              >
                <i-switch v-model="item.switch" @on-change="changeMenu(item)" slot="extra"/>
              </Cell>
              <div v-if="item.children.length>0" class="menu-list-button" :key="item.id.toString()">
                <span
                  v-for="(element,iii) in item.children"
                  :key="'element'+iii"
                  class="item-button"
                >
                  {{element.name}}
                  <i-switch size="small" v-model="element.switch" @on-change="changeMenu(element)"/>
                </span>
              </div>
            </template>
          </template>
        </CellGroup>
      </div>
      <Alert type="warning" banner show-icon style="margin:10px 0 0 0;">菜单权限新增修改后，需要用户重新登录才生效</Alert>
    </Modal>
  </div>
</template>

<script>
import $RoleService from "../../service/role";
import $UserService from "../../service/user";
import $UserRoleService from "../../service/userRole";
import $RoleMenuService from "../../service/roleMenu";
import $MenuService from "../../service/menu";
export default {
  name: "Role",
  data() {
    return {
      saveLoading: true,
      roleModalShow: false,
      userModalShow: false,
      menuModalShow: false,
      formValidate: {
        name: [
          {
            type: "string",
            required: true,
            message: "请填写角色名称",
            trigger: "blur"
          }
        ],
        code: [
          {
            type: "string",
            required: true,
            message: "请填写角色代码",
            trigger: "blur"
          }
        ]
      },
      roleFormData: {
        id: null,
        name: null,
        code: null
      },
      userFromData: {
        role: {},
        fromUsers: [],
        targetUsers: []
      },
      menuFromData: {
        role: {}
      },
      roles: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    roleModal(item = null) {
      if (item) {
        item.id = item.id.toString();
        this.roleFormData = { ...item };
      } else {
        this.roleFormData = {};
      }
      this.roleModalShow = true;
    },
    saveRole() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          this.saveRoleAction();
        } else {
          setTimeout(() => {
            this.saveLoading = false;
            this.$nextTick(() => {
              this.saveLoading = true;
            });
          }, 500);
        }
      });
    },
    saveRoleAction() {
      var roleData = { ...this.roleFormData };
      var service = roleData.id
        ? $RoleService.update(roleData)
        : $RoleService.insert(roleData);
      service.then(res => {
        if (res.code === 1) {
          this.$Message.success(
            roleData.id ? "角色更新成功！" : "角色新增成功！"
          );
          this.roleModalShow = false;
          this.getList();
        } else {
          this.$Message.success(res.msg);
          setTimeout(() => {
            this.saveLoading = false;
            this.$nextTick(() => {
              this.saveLoading = true;
            });
          }, 500);
        }
      });
    },
    deleteRole(role, i) {
      this.$Modal.confirm({
        title: "系统提示",
        content: "确定要删除该角色吗？删除后无法恢复，请谨慎操作",
        onOk: () => {
          $RoleService.delete({ ids: role.id.toString() }).then(res => {
            if (res.code === 1) {
              this.roles.splice(i, 1);
            } else {
              this.$Message.error(res.msg);
            }
          });
        }
      });
    },
    changeMenu(obj) {
      if (obj.switch == false && obj.relation) {
        $RoleMenuService.delete({ ids: obj.relation });
      } else {
        $RoleMenuService
          .insert({
            roleId: this.menuFromData.role.id.toString(),
            menuId: obj.id.toString()
          })
          .then(res => {
            if (res.code === 1) {
              obj.relation = res.data.id.toString();
            }
          });
      }
    },
    setMenuModal(role) {
      this.menuFromData.menuList = [];
      this.menuFromData.role = role;
      let request = [
        $MenuService.select({ ps: 1000 }),
        $RoleMenuService.select({ roleId: role.id.toString(), ps: 1000 })
      ];
      Promise.all(request).then(res => {
        let menuList = this.matchMenuList(
          res[0].data.records,
          res[1].data.records
        );
        this.menuFromData.menuList = menuList;
        this.menuModalShow = true;
      });
    },
    matchMenuList(source, target) {
      source.map(item => {
        let findRrelation = target.find(
          ele => ele.menuId.toString() === item.id.toString()
        );
        if (findRrelation) {
          item.relation = findRrelation.id.toString();
          item.switch = true;
        } else {
          item.switch = false;
        }
        if (item.children && item.children.length > 0) {
          this.matchMenuList(item.children, target);
        }
      });
      return source;
    },
    setUserRoleModal(role) {
      this.userFromData.role = role;
      let request = [
        $UserService.select({ ps: 1000 }),
        $UserRoleService.select({ roleId: role.id.toString(), ps: 1000 })
      ];
      Promise.all(request).then(res => {
        var fromUsers = [];
        res[0].data.records.map(item => {
          let findRrelation = res[1].data.records.find(
            ele => ele.userId.toString() === item.id.toString()
          );
          fromUsers.push({
            key: item.id.toString(),
            label: item.username,
            relationId: findRrelation ? findRrelation.id.toString() : null
          });
        });
        let userRole = res[1].data.records.map(item => item.userId.toString());
        var targetUsers = fromUsers
          .filter(item => userRole.includes(item.key))
          .map(item => item.key);
        this.userFromData.fromUsers = fromUsers;
        this.userFromData.targetUsers = targetUsers;

        this.userModalShow = true;
      });
    },
    setChange(targetKeys, direction, moveKeys) {
      this.userFromData.targetUsers = targetKeys;
      if (direction == "right") {
        moveKeys.forEach(key => {
          $UserRoleService
            .insert({
              roleId: this.userFromData.role.id.toString(),
              userId: key
            })
            .then(res => {
              if (res.code === 1) {
                this.userFromData.fromUsers.map(item => {
                  if (item.key == res.data.userId.toString()) {
                    console.log(res.data.userId.toString());
                    item.relationId = res.data.id.toString();
                  }
                });
              }
            });
        });
      } else {
        let relations = this.userFromData.fromUsers.filter(item =>
          moveKeys.includes(item.key)
        );
        let ids = relations.map(item => item.relationId);
        $UserRoleService.delete({ ids: ids });
      }
    },
    getList() {
      $RoleService.select({ ps: 1000 }).then(res => {
        if (res.code === 1) {
          this.roles = res.data.records;
        }
      });
    }
  }
};
</script>

<style lang="less">
.transfer-set .ivu-transfer-list {
  height: 280px;
}
</style>
<style lang="less" scoped>
.menu-list {
  height: 70vh;
  overflow: auto;
  &-dir {
    border-bottom: 1px solid #f2f2f2;
  }
  &-menu {
    margin-left: 20px;
    border-bottom: 1px dotted #f2f2f2;
  }
  &-button {
    padding: 5px 15px 10px 15px;
    margin-left: 20px;
    border-bottom: 1px dotted #f2f2f2;
    .item-button {
      display: inline-block;
      border: 1px solid #ccc;
      padding: 4px 8px;
      border-radius: 2px;
      margin: 2px 5px 2px 0;
    }
  }
}
</style>
