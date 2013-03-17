<?php
class AGSATTRACK_ELEMENTS extends APPCONTROLLER {
    public $components = Array('ELEMENTSET', 'UPDATER');
    
    public function __construct($initData) {
        parent::__construct($initData);
    }
    
    public function getElements() {
        $this->checkQS(array(
            'group' => array(
                'qsvar' => 'group',
                'default' => '',
                'fatal' => true
            )
        ));
        
        $group = $_GET['group'];
        $keps = Kep::find('first', array('conditions' => array('kepsgroup = ?', $group)));

        $ageData = $this->AGSATTRACK_ELEMENTSET->getAverageAge($keps->elements);
        $this->output = Array(
            'id' => $group,
            'averageage' => $ageData,
            'updateat' => 5,
            'keps' => $keps->elements
        );  
    } 

    public function getGroups() {
        $this->output = Array();
        foreach (Tlegroup::find('all') as $group) {
            $this->output[] = Array(
                'id'=>$group->id,
                'name'=>$group->name,
                'selected' => ($group->default?true:false)
            );
        }        
    }
    
    public function updateElementGroup() {
        $this->checkQS(array(
            'group' => array(
                'qsvar' => 'group',
                'default' => '',
                'fatal' => true
            )
        ));
        
        $this->output = $this->AGSATTRACK_UPDATER->updateGroup($_GET['group'] . '.txt');        
    } 
}
